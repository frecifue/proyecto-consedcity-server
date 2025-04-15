const { AppDataSource } = require("../data-source");
const { GaleriaImagenesEntity } = require("../entities/galeria_imagenes");  // Importar el modelo User con TypeORM
const { PostEntity } = require("../entities/post");
const fs = require("fs");
const path = require("path");
const { trimLowerCase } = require("../utils/cleanInput");
const documentPath = require("../utils/documentPath");

const imageGalleryRepository = AppDataSource.getRepository(GaleriaImagenesEntity);
const postRepository = AppDataSource.getRepository(PostEntity);

async function getImagesGallery(req, res) {
    const { page = "1", limit = "10" } = req.query; // Asegurar valores por defecto como strings
    
    try {
        const pageNumber = parseInt(page, 10); // Convertir a número
        const limitNumber = parseInt(limit, 10); // Convertir a número

        if (isNaN(pageNumber) || isNaN(limitNumber)) {
            return res.status(400).send({ msg: "Los parámetros 'page' y 'limit' deben ser números válidos" });
        }

        const skip = (pageNumber - 1) * limitNumber; // Cálculo correcto

        const [images, total] = await imageGalleryRepository.findAndCount({
            skip,
            take: limitNumber,
            order: { gim_created_at: "DESC" },
            // relations: ["posts"]
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
        return res.status(400).send({ msg: "Error al obtener la galeria de imágenes" });
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

        const finalPath = documentPath.generateFilePathWithDate(req.files.imagen, "galeria_imagenes"); // Ruta relativa tipo uploads/documents/2025/04/uuid.pdf
        newImageGallery.gim_imagen = finalPath;

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
            // Eliminar el avatar anterior si existe
            if (imageGallery.gim_imagen) {
                const avatarPath = path.join(__dirname, "..", "uploads", imageGallery.gim_imagen);

                fs.unlink(avatarPath, (err) => {
                    if (err) {
                        console.error("Error al eliminar la imagen anterior:", err);
                    } else {
                        console.log("Imagen anterior eliminado");
                    }
                });
            }

            // Guardar el nuevo avatar
            const finalPath = documentPath.generateFilePathWithDate(req.files.imagen, "galeria_imagenes"); // Ruta relativa tipo uploads/documents/2025/04/uuid.pdf
            imageGallery.gim_imagen = finalPath;
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

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const queryImageGalleryRepository = queryRunner.manager.getRepository("GaleriaImagenesEntity");
        const queryPostRepository = queryRunner.manager.getRepository("PostEntity");

        // Buscar la imagen
        const imageGallery = await queryImageGalleryRepository.findOne({ where: { gim_id: gimId } });

        if (!imageGallery) {
            await queryRunner.rollbackTransaction();
            return res.status(404).send({ msg: "Imagen no encontrada" });
        }

        // Buscar posts que contienen esta imagen
        const postsWithImage = await queryPostRepository
            .createQueryBuilder("post")
            .leftJoin("post.imagenes", "imagenFiltro")
            .where("imagenFiltro.gim_id = :gimId", { gimId })
            .leftJoinAndSelect("post.imagenes", "imagenCompleta")
            .getMany();

        for (const post of postsWithImage) {
            post.imagenes = post.imagenes.filter(img => img.gim_id !== parseInt(gimId));
            await queryPostRepository.save(post);
        }

        // verificamos si la imagen sigue en uso en otras noticias
        const stillUsed = await queryPostRepository
            .createQueryBuilder("post")
            .leftJoin("post.imagenes", "imagen")
            .where("imagen.gim_id = :gimId", { gimId })
            .getCount();

        if (stillUsed === 0) {
            // Eliminar archivo del sistema
            if (imageGallery.gim_imagen) {
                const avatarPath = path.join(__dirname, "..", "uploads", imageGallery.gim_imagen);
                console.log("Intentando eliminar el archivo en: ", avatarPath);

                fs.unlink(avatarPath, (err) => {
                    if (err) {
                        console.error("Error al eliminar la imagen del disco:", err);
                    } else {
                        console.log("Archivo eliminado exitosamente del disco");
                    }
                });
            }

            await queryImageGalleryRepository.remove(imageGallery);
            await queryRunner.commitTransaction();
            return res.status(200).send({ msg: "Imagen eliminada correctamente" });
        } else {
            // Si aún se usa en otros posts, revertimos todo
            await queryRunner.rollbackTransaction();
            return res.status(400).send({
                msg: "No se puede eliminar la imagen porque sigue en uso por otras noticias"
            });
        }

    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error(error);
        return res.status(400).send({ msg: "Error al eliminar imagen", error: error.message });
    } finally {
        await queryRunner.release();
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