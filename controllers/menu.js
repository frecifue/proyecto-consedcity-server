const { getRepository } = require("typeorm");
const { MenuEntity } = require("../entities/menu");  // Importar el modelo User con TypeORM
const fs = require("fs");
const path = require("path");

async function getMenus(req, res){
    const {activo} = req.query;
    let response = null;

    const menuRepository = getRepository(MenuEntity);

    if(activo === undefined){
        response = await menuRepository.find();
    }else{
        let isActive;
        if (activo === "true") {
            isActive = 1;
        } else if (activo === "false") {
            isActive = 0;
        } else {
            isActive = parseInt(activo, 10);
        }

        if (isNaN(isActive)) {
            return res.status(400).send({ error: "El parámetro 'activo' debe ser 0 o 1" });
        }
        response = await menuRepository.find({where: { men_activo : isActive}});
    }

    return res.status(200).send(response);

}

async function createMenu(req, res){
    const { titulo, path, orden, activo } = req.body;
    // console.log(req.body);


    // Validaciones de campos obligatorios
    if (!titulo) {
        return res.status(400).send({ msg: "titulo obligatorio" });
    }
    if (!path) {
        return res.status(400).send({ msg: "ruta obligatoria" });
    }
    if (!orden) {
        return res.status(400).send({ msg: "orden obligatorio" });
    }

    try {
        // Verificar si el email ya existe
        const menuRepository = getRepository(MenuEntity);
        // const existingUser = await menuRepository.findOne({ email: email.toLowerCase() });
        const existingMenu = await menuRepository.findOne({ where: { men_path: path.toLowerCase() } });

        if (existingMenu) {
            return res.status(400).send({ msg: "El menú con esa ruta ya existe" });
        }

        // Crear el nuevo menu
        const newMenu = menuRepository.create({
            men_titulo: titulo,
            men_path: path,
            men_orden: orden,
            men_activo: (typeof activo === 'boolean') ? (activo ? 1 : 0) : 0,
        });

        await menuRepository.save(newMenu);

        return res.status(200).send(newMenu);
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al crear menu" });
    }

}

async function updateMenu(req, res) {
    const { menId } = req.params;
    const { titulo, path, orden, activo } = req.body;
    
    if (!menId) {
        return res.status(400).send({ msg: "menId no encontrado" });
    }

    try {
        // Verificar si el menu existe
        const menuRepository = getRepository(MenuEntity);
        const menu = await menuRepository.findOne({ where: { men_id: menId } });

        if (!menu) {
            return res.status(404).send({ msg: "Menú no encontrado" });
        }

        // Verificar si se proporciona un nuevo email y si ya está registrado
        if (path && path !== menu.men_path) {
            // Verificar si el path ya está registrado
            const existingMenu = await menuRepository.findOne({ where: { men_path: path.toLowerCase() } });

            if (existingMenu) {
                return res.status(400).send({ msg: "El menú con esa ruta ya existe" });
            }

            menu.men_path = path.toLowerCase();
        }

        // Actualizar los campos del menu si se proporcionan
        if (titulo) menu.men_titulo = titulo;
        if (orden) menu.men_orden = orden;
        if (activo === "true" || activo === true) {
            menu.men_activo = 1;
        } else if (activo === "false" || activo === false) {
            menu.men_activo = 0;
        } else {
            menu.men_activo = parseInt(activo, 10);
        }
    
        if (isNaN(menu.men_activo) || (menu.men_activo !== 1 && menu.men_activo !== 0)) {
            menu.men_activo = 0;
        }

        // Guardar los cambios
        // const updatedUser = await user.save();
        await menuRepository.save(menu);

        return res.status(200).send(menu);

    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al actualizar menú" });
    }
}


async function deleteMenu(req, res) {
    const { menId } = req.params;

    if (!menId) {
        return res.status(400).send({ msg: "menId no encontrado" });
    }

    try {
        // Verificar si el menu existe
        const menuRepository = getRepository(MenuEntity);
        const menu = await menuRepository.findOne({ where: { men_id: menId } });

        if (!menu) {
            return res.status(404).send({ msg: "Menú no encontrado" });
        }

        // Eliminar el menu
        await menuRepository.remove(menu); 

        return res.status(200).send({ msg: "Menú eliminado exitosamente" });
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al eliminar menú", error: error.message });
    }
}

module.exports = {
    getMenus,
    createMenu,
    updateMenu,
    deleteMenu,
};