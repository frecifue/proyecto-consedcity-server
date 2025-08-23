const { AppDataSource } = require("../data-source");
const { GaleriaImagenesEntity } = require("../entities/galeria_imagenes");  // Importar el modelo User con TypeORM
const { trimLowerCase } = require("../utils/cleanInput");
const fileUtils = require("../utils/fileUtils");

const imageGalleryRepository = AppDataSource.getRepository(GaleriaImagenesEntity);

async function getImagesGallery(req, res) {
    const { page = "1", limit = "10" } = req.query; // Asegurar valores por defecto como strings
    
    try {
        const pageNumber = parseInt(page, 10); 
        const limitNumber = parseInt(limit, 10); 

        if (isNaN(pageNumber) || isNaN(limitNumber)) {
            return res.status(400).send({ msg: "Los parámetros 'page' y 'limit' deben ser números válidos" });
        }

        const skip = (pageNumber - 1) * limitNumber; 

        const [images, total] = await imageGalleryRepository.findAndCount({
            skip,
            take: limitNumber,
            order: { gim_orden: "ASC" }
        });

        return res.status(200).send({
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            limit: limitNumber,
            images,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al obtener la galeria de imagenes" });
    }
}

async function getImageGallery(req, res){

    const response = await imageGalleryRepository.find({order: {gim_orden: "ASC"}});
    
    return res.status(200).send(response);
}

async function createImageGallery(req, res){
    let { nombre, orden, en_home } = req.body;

    nombre = trimLowerCase(nombre)
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
    if (!nombre || !req.files.imagen || isNaN(orden)) {

        if (req.files?.imagen) {
            fileUtils.cleanTempFile(req.files.imagen);
        }

        return res.status(400).send({ msg: "nombre, imagen y orden obligatorio" });
    }

    try {
        
        const newImageGallery = imageGalleryRepository.create({
            gim_nombre: nombre,
            gim_orden: orden,
            gim_en_home: en_home
        });

        newImageGallery.gim_imagen = fileUtils.generateFilePathWithDate(req.files.imagen, "galeria_imagenes");
        
        await imageGalleryRepository.save(newImageGallery);

        return res.status(200).send(newImageGallery);
    } catch (error) {

        if (req.files?.imagen) {
            fileUtils.cleanTempFile(req.files.imagen);
        }

        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al registrar imagen" });
    }

}

async function updateImageGallery(req, res) {
    const { gimId } = req.params;
    let { nombre, orden, en_home } = req.body;
    
    if (!gimId) {

        if (req.files?.imagen) {
            fileUtils.cleanTempFile(req.files.imagen);
        }

        return res.status(400).send({ msg: "gimId no encontrada" });
    }

    nombre = trimLowerCase(nombre)
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
        // Verificar si la imagen existe
        const imageGallery = await imageGalleryRepository.findOne({ where: { gim_id: gimId } });

        if (!imageGallery) {

            if (req.files?.imagen) {
                fileUtils.cleanTempFile(req.files.imagen);
            }

            return res.status(404).send({ msg: "Imagen no encontrada" });
        }

        // Actualizar los campos de la imagen si se proporcionan
        if (nombre) imageGallery.gim_nombre = nombre.toLowerCase();
        if (!isNaN(orden)) imageGallery.gim_orden = orden;
        imageGallery.gim_en_home = en_home; // <-- agregado en_home

        // Si se proporciona una nueva imagen, actualizarlo
        if (req.files && req.files.imagen) {
            // Eliminar file anterior si existe
            if (imageGallery.gim_imagen) {
                fileUtils.deleteFile(imageGallery.gim_imagen);
            }
            // Guardar nueva fila
            imageGallery.gim_imagen = fileUtils.generateFilePathWithDate(req.files.imagen, "galeria_imagenes"); // Ruta relativa tipo documentos/2025/04/uuid.pdf
        }

        // Guardar los cambios
        await imageGalleryRepository.save(imageGallery);
        return res.status(200).send(imageGallery);

    } catch (error) {

        if (req.files?.imagen) {
            fileUtils.cleanTempFile(req.files.imagen);
        }

        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al actualizar imagen" });
    }
}

async function deleteImageGallery(req, res) {
    const { gimId } = req.params;

    if (!gimId) {
        return res.status(400).send({ msg: "gimId no encontrada" });
    }

    try {
        // Verificar si la imagen existe
        const imageGallery = await imageGalleryRepository.findOne({ where: { gim_id: gimId } });

        if (!imageGallery) {
            return res.status(404).send({ msg: "Imagen no encontrada" });
        }

        // Eliminar file anterior si existe
        if (imageGallery.gim_imagen) {
            fileUtils.deleteFile(imageGallery.gim_imagen);
        }

        // Eliminar la imagen
        await imageGalleryRepository.remove(imageGallery); // Usar el metodo remove del repositorio

        return res.status(200).send({ msg: "Imagen eliminado exitosamente" });
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al eliminar imagen", error: error.message });
    }
}


module.exports = {
    deleteImageGallery,
};



module.exports = {
    getImagesGallery,
    getImageGallery,
    createImageGallery,
    updateImageGallery,
    deleteImageGallery,
};