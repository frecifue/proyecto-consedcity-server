const { getRepository } = require("typeorm");
const { EquipoEntity } = require("../entities/equipo");  // Importar el modelo User con TypeORM
const image = require("../utils/image");
const fs = require("fs");
const path = require("path");


async function getTeams(req, res){
    let response = null;

    const teamRepository = getRepository(EquipoEntity);

    response = await teamRepository.find({order: {equ_orden: "ASC"}});
   
    return res.status(200).send(response);

}

async function createTeam(req, res){
    const { nombre, descripcion, orden } = req.body;

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
    if (!orden) {
        return res.status(400).send({ msg: "orden obligatorio" });
    }

    try {
        // Verificar si el path ya existe
        const teamRepository = getRepository(EquipoEntity);

        const newTeam = teamRepository.create({
            equ_nombre: nombre,
            equ_descripcion: descripcion,
            equ_orden: orden
        });

        if(req.files.foto_perfil){
            newTeam.equ_foto_perfil = image.getFilePath(req.files.foto_perfil)
        }

        // Guardar el nuevo equipo en la base de datos
        // const userStorage = await newTeam.save();
        await teamRepository.save(newTeam);

        return res.status(200).send(newTeam);
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al crear mienbro del equipo" });
    }

}

async function updateTeam(req, res) {
    const { equId } = req.params;
    
    const { nombre, descripcion, orden } = req.body;
    
    if (!equId) {
        return res.status(400).send({ msg: "equId no encontrado" });
    }

    try {
        // Verificar si el equipo existe
        const teamRepository = getRepository(EquipoEntity);
        const equipo = await teamRepository.findOne({ where: { equ_id: equId } });

        if (!equipo) {
            return res.status(404).send({ msg: "Miembro del equipo no encontrado" });
        }

        // Actualizar los campos del equipo si se proporcionan
        if (nombre) equipo.equ_nombre = nombre;
        if (descripcion) equipo.equ_descripcion = descripcion;
        if (orden) equipo.equ_orden = orden;

        // Si se proporciona un nuevo avatar, actualizarlo
        if (req.files && req.files.foto_perfil) {
            // Eliminar el avatar anterior si existe
            if (equipo.equ_foto_perfil) {
                const imgPath = path.join(__dirname, "..", "uploads", equipo.equ_foto_perfil);
                fs.unlink(imgPath, (err) => {
                    if (err) {
                        console.error("Error al eliminar la foto perfil anterior:", err);
                    } else {
                        console.log("foto perfil anterior eliminado");
                    }
                });
            }

            // Guardar el nuevo avatar
            equipo.equ_foto_perfil = image.getFilePath(req.files.foto_perfil);
        }

        // Guardar los cambios
        // const updatedUser = await user.save();
        await teamRepository.save(equipo);

        return res.status(200).send(equipo);

        // return res.status(200).send(updatedUser);
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
        const teamRepository = getRepository(EquipoEntity);
        // const user = await teamRepository.findOne({ where: { equ_id } });
        const equipo = await teamRepository.findOne({ where: { equ_id: equId } });

        if (!equipo) {
            return res.status(404).send({ msg: "Miembro del equipo no encontrado" });
        }

        // Verificar si el equipo tiene un img y eliminar el archivo
        if (equipo.equ_foto_perfil) {
            // Obtener la ruta relativa del avatar
            const avatarPath = path.join(__dirname, "..", "uploads", equipo.equ_foto_perfil);

            console.log("Intentando eliminar el archivo en: ", avatarPath);

            // Eliminar el archivo de avatar
            fs.unlink(avatarPath, (err) => {
                if (err) {
                    console.error("Error al eliminar la Foto Perfil:", err);
                } else {
                    console.log("foto Perfil eliminado exitosamente");
                }
            });
        }

        // Eliminar el equipo
        await teamRepository.remove(equipo); // Usar el método remove del repositorio

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