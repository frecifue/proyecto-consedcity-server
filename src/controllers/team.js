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
    let { nombre, descripcion, orden } = req.body;

    nombre = (nombre || "").trim();
    descripcion = (descripcion || "").trim();
    orden = parseInt(orden);

    // Validaciones de campos obligatorios
    if (!nombre) {
        return res.status(400).send({ msg: "nombre obligatorio" });
    }
    if (!req.files.foto_perfil) {
        return res.status(400).send({ msg: "foto perfil obligatoria" });
    }
    if (!descripcion) {
        return res.status(400).send({ msg: "descripcion obligatoria" });
    }
    if (isNaN(orden)) {
        return res.status(400).send({ msg: "orden obligatorio" });
    }

    try {
        // Verificar si el path ya existe
        const newTeam = teamRepository.create({
            equ_nombre: nombre,
            equ_descripcion: descripcion,
            equ_orden: orden
        });

        newTeam.equ_foto_perfil = fileUtils.generateFilePath(req.files.foto_perfil, "team/foto_perfil");

        // Guardar el nuevo equipo en la base de datos
        await teamRepository.save(newTeam);

        return res.status(200).send(newTeam);
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al crear mienbro del equipo" });
    }

}

async function updateTeam(req, res) {
    const { equId } = req.params;
    let { nombre, descripcion, orden } = req.body;
    
    if (!equId) {
        return res.status(400).send({ msg: "equId no encontrado" });
    }

    nombre = (nombre || "").trim();
    descripcion = (descripcion || "").trim();
    orden = parseInt(orden);

    try {
        // Verificar si el equipo existe
        const equipo = await teamRepository.findOne({ where: { equ_id: equId } });

        if (!equipo) {
            return res.status(404).send({ msg: "Miembro del equipo no encontrado" });
        }

        // Actualizar los campos del equipo si se proporcionan
        if (nombre) equipo.equ_nombre = nombre;
        if (descripcion) equipo.equ_descripcion = descripcion;
        if (!isNaN(orden)) equipo.equ_orden = orden;

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