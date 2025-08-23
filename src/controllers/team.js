const { AppDataSource } = require("../data-source");
const { EquipoEntity } = require("../entities/equipo");  // Importar el modelo User con TypeORM
const fileUtils = require("../utils/fileUtils");

const teamRepository = AppDataSource.getRepository(EquipoEntity);

async function getTeams(req, res){
    let response = null;

    response = await teamRepository.find({order: {equ_orden: "ASC"}});
   
    return res.status(200).send(response);

}

async function createTeam(req, res){
    let { nombre, descripcion, orden, en_home } = req.body;

    nombre = (nombre || "").trim();
    descripcion = (descripcion || "").trim();
    orden = parseInt(orden);

    // Validación de en_home
    if (en_home === undefined || en_home === null) {
        en_home = 0;
    } else if (typeof en_home === "boolean") {
        en_home = en_home ? 1 : 0;
    } else {
        en_home = parseInt(en_home);
        if (![0,1].includes(en_home)) {
            en_home = 0;
        }
    }

    // Validaciones de campos obligatorios
    if(!nombre || !req.files.foto_perfil || !descripcion || isNaN(orden)){
        if (req.files?.foto_perfil) {
            fileUtils.cleanTempFile(req.files.foto_perfil);
        }
        return res.status(400).send({ msg: "nombre, foto perfil, descripción y orden obligatorio" });
    }

    try {
        // Verificar si el path ya existe
        const newTeam = teamRepository.create({
            equ_nombre: nombre,
            equ_descripcion: descripcion,
            equ_orden: orden,
            equ_en_home: en_home
        });

        newTeam.equ_foto_perfil = fileUtils.generateFilePath(req.files.foto_perfil, "team/foto_perfil");

        // Guardar el nuevo equipo en la base de datos
        await teamRepository.save(newTeam);

        return res.status(200).send(newTeam);
    } catch (error) {
        if (req.files?.foto_perfil) {
            fileUtils.cleanTempFile(req.files.foto_perfil);
        }
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al crear mienbro del equipo" });
    }

}

async function updateTeam(req, res) {
    const { equId } = req.params;
    let { nombre, descripcion, orden, en_home } = req.body;
    
    if (!equId) {
        if (req.files?.foto_perfil) {
            fileUtils.cleanTempFile(req.files.foto_perfil);
        }
        return res.status(400).send({ msg: "equId no encontrado" });
    }

    nombre = (nombre || "").trim();
    descripcion = (descripcion || "").trim();
    orden = parseInt(orden);

    // --- NUEVO: Validación y normalización de en_home ---
    if (en_home === undefined || en_home === null) {
        en_home = 0;
    } else if (typeof en_home === "string") {
        en_home = en_home === "1" || en_home.toLowerCase() === "true" ? 1 : 0;
    } else if (typeof en_home === "boolean") {
        en_home = en_home ? 1 : 0;
    } else {
        en_home = en_home ? 1 : 0;
    }
    // --- FIN NUEVO ---

    try {
        // Verificar si el equipo existe
        const equipo = await teamRepository.findOne({ where: { equ_id: equId } });

        if (!equipo) {
            if (req.files?.foto_perfil) {
                fileUtils.cleanTempFile(req.files.foto_perfil);
            }
            return res.status(404).send({ msg: "Miembro del equipo no encontrado" });
        }

        // Actualizar los campos del equipo si se proporcionan
        if (nombre) equipo.equ_nombre = nombre;
        if (descripcion) equipo.equ_descripcion = descripcion;
        if (!isNaN(orden)) equipo.equ_orden = orden;
        equipo.equ_en_home = en_home;

        // Si se proporciona un nuevo avatar, actualizarlo
        if (req.files && req.files.foto_perfil) {
            // Eliminar file anterior si existe
            if (equipo.equ_foto_perfil) {
                fileUtils.deleteFile(equipo.equ_foto_perfil);
            }
            
            equipo.equ_foto_perfil = fileUtils.generateFilePath(req.files.foto_perfil, "team/foto_perfil");
        }

        // Guardar los cambios
        await teamRepository.save(equipo);

        return res.status(200).send(equipo);
    } catch (error) {
        if (req.files?.foto_perfil) {
            fileUtils.cleanTempFile(req.files.foto_perfil);
        }
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al actualizar miembro del equipo" });
    }
}


async function deleteTeam(req, res) {
    const { equId } = req.params;

    if (!equId) {
        return res.status(400).send({ msg: "equId no encontrado" });
    }

    try {
        // Verificar si el equipo existe
        const equipo = await teamRepository.findOne({ where: { equ_id: equId } });

        if (!equipo) {
            return res.status(404).send({ msg: "Miembro del equipo no encontrado" });
        }

        if (equipo.equ_foto_perfil) {
            fileUtils.deleteFile(equipo.equ_foto_perfil);
        }

        // Eliminar el equipo
        await teamRepository.remove(equipo); // Usar el metodo remove del repositorio

        return res.status(200).send({ msg: "Miembro del equipo eliminado exitosamente" });
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al eliminar mienbro del equipo", error: error.message });
    }
}

module.exports = {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam,
};