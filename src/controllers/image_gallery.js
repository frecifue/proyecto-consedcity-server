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
            return res.status(400).send({ msg: "Los parï¿½metros 'page' y 'limit' deben ser nï¿½meros vï¿½lidos" });
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
        return res.status(400).send({ msg: "Error al obtener la galeria de imï¿½genes" });
    }
}

async function getImageGallery(req, res){

    const response = await imageGalleryRepository.find({order: {gim_orden: "ASC"}});
    
    return res.status(200).send(response);
}

async function createImageGallery(req, res){
    let { nombre, orden } = req.body;

    nombre = trimLowerCase(nombre)
    orden = parseInt(orden);

    // Validaciones de campos obligatorios
    if (!nombre) {
        return res.status(400).send({ msg: "nombre obligatorio" });
    }
    if(!req.files.imagen){
        return res.status(400).send({ msg: "imagen obligatoria" });
    }
    if (isNaN(orden)) {
        return res.status(400).send({ msg: "orden obligatorio" });
    }

    try {
        
        const newImageGallery = imageGalleryRepository.create({
            gim_nombre: nombre,
            gim_orden: orden,
        });

        newImageGallery.gim_imagen = fileUtils.generateFilePathWithDate(req.files.imagen, "galeria_imagenes");
        
        await imageGalleryRepository.save(newImageGallery);

        return res.status(200).send(newImageGallery);
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al registrar imagen" });
    }

}

async function updateImageGallery(req, res) {
    const { gimId } = req.params;
    let { nombre, orden } = req.body;
    
    if (!gimId) {
        return res.status(400).send({ msg: "gimId no encontrada" });
    }

    nombre = trimLowerCase(nombre)
    orden = parseInt(orden);

    try {
        // Verificar si la imagen existe
        const imageGallery = await imageGalleryRepository.findOne({ where: { gim_id: gimId } });

        if (!imageGallery) {
            return res.status(404).send({ msg: "Imagen no encontrada" });
        }

        // Actualizar los campos de la imagen si se proporcionan
        if (nombre) imageGallery.gim_nombre = nombre.toLowerCase();
        if (!isNaN(orden)) imageGallery.gim_orden = orden;

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
        await imageGalleryRepository.remove(imageGallery); // Usar el método remove del repositorio

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