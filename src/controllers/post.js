const { In } = require("typeorm");
const { AppDataSource } = require("../data-source");
const { PostEntity } = require("../entities/post");  // Importar el modelo User con TypeORM
const { DocumentEntity } = require("../entities/documentos"); 
const { GaleriaImagenesEntity } = require("../entities/galeria_imagenes"); 
const { trimLowerCase } = require("../utils/cleanInput");
const fileUtils = require("../utils/fileUtils");

const postRepository = AppDataSource.getRepository(PostEntity);
const imgGalleryRepository = AppDataSource.getRepository(GaleriaImagenesEntity);
const documentRepository = AppDataSource.getRepository(DocumentEntity);

async function getPosts(req, res) {
    const { page = "1", limit = "10" } = req.query; // Asegurar valores por defecto como strings

    try {
        const pageNumber = parseInt(page, 10); // Convertir a numero
        const limitNumber = parseInt(limit, 10); // Convertir a numero

        if (isNaN(pageNumber) || isNaN(limitNumber)) {
            return res.status(400).send({ msg: "Los parametros 'page' y 'limit' deben ser números válidos" });
        }

        const skip = (pageNumber - 1) * limitNumber; // Calculo correcto
        const [posts, total] = await postRepository.findAndCount({
            skip,
            take: limitNumber,
            order: { pos_created_at: "DESC" },
            relations: ["documentos","imagenes" ],
        });

        return res.status(200).send({
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            limit: limitNumber,
            posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al obtener las noticias" });
    }
}

async function getPost(req, res) {
    const { path } = req.params;
    
    try {
        const existingPost = await postRepository.findOne({ 
            where: { pos_path: path.toLowerCase() },
            relations: ["documentos", "imagenes"],
        });

        if(!existingPost){
            return res.status(400).send({ msg: "No se ha encontrado ninguna noticia" });
        }
    
        return res.status(200).send(existingPost);    
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al obtener la noticia" });
    }
}


async function createPost(req, res){
    let { titulo, contenido, path_post } = req.body;
    
    titulo = (titulo || "").trim();
    contenido = (contenido || "").trim();
    path_post = trimLowerCase(path_post);

    // Validaciones de campos obligatorios
    if (!titulo) {
        return res.status(400).send({ msg: "título obligatorio" });
    }
    if (!req.files.img_principal) {
        return res.status(400).send({ msg: "imágen principal obligatoria" });
    }
    if (!contenido) {
        return res.status(400).send({ msg: "contenido obligatorio" });
    }
    if (!path_post) {
        return res.status(400).send({ msg: "ruta obligatorio" });
    }

    try {
        // Verificar si el path ya existe
        const existingPost = await postRepository.findOne({ where: { pos_path: path_post } });

        if (existingPost) {
            return res.status(400).send({ msg: "La ruta ya está registrada" });
        }

        const newPost = postRepository.create({
            pos_titulo: titulo,
            pos_contenido: contenido,
            pos_path: path_post
        });

        newPost.pos_img_principal = fileUtils.generateFilePathWithDate(req.files.img_principal, "posts");

        // Guardar el nuevo post en la base de datos
        await postRepository.save(newPost);

        return res.status(200).send(newPost);
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al crear la noticia" });
    }

}

async function updatePost(req, res) {
    const { posId } = req.params;
    let { titulo, contenido, path_post } = req.body;
    
    if (!posId) {
        return res.status(400).send({ msg: "posId no encontrado" });
    }

    titulo = (titulo || "").trim();
    contenido = (contenido || "").trim();
    path_post = trimLowerCase(path_post);

    try {
        // Verificar si el post existe
        const post = await postRepository.findOne({ where: { pos_id: posId } });

        if (!post) {
            return res.status(404).send({ msg: "Post no encontrado" });
        }

        // Verificar si se proporciona un nuevo path y si ya esta registrado
        if (path_post && path_post !== post.pos_path) {
            // Verificar si el nuevo email ya esta registrado
            const existingPost = await postRepository.findOne({ where: { pos_path: path_post } });
            if (existingPost) {
                return res.status(400).send({ msg: "La ruta ya está registrada" });
            }
            post.pos_path = path_post.toLowerCase();
        }

        // Actualizar los campos del post si se proporcionan
        if (titulo) post.pos_titulo = titulo;
        if (contenido) post.pos_contenido = contenido;

        // Verificar si el post tiene un img y eliminar el archivo
        if (req.files && req.files.img_principal) {
            // Eliminar file anterior si existe
            if (post.pos_img_principal) {
                fileUtils.deleteFile(post.pos_img_principal);
            }
            // Guardar nueva file
            post.pos_img_principal = fileUtils.generateFilePathWithDate(req.files.img_principal, "posts"); 
        }

        // Guardar los cambios
        await postRepository.save(post);

        return res.status(200).send(post);
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al actualizar la noticia" });
    }
}


async function deletePost(req, res) {
    const { posId } = req.params;

    if (!posId) {
        return res.status(400).send({ msg: "posId no encontrado" });
    }

    try {
        // Verificar si el post existe
        const post = await postRepository.findOne({ where: { pos_id: posId } });

        if (!post) {
            return res.status(404).send({ msg: "Noticia no encontrada" });
        }

        // Eliminar file anterior si existe
        if (post.pos_img_principal) {
            fileUtils.deleteFile(post.pos_img_principal);
        }

        // Eliminar el post
        await postRepository.remove(post); // Usar el metodo remove del repositorio

        return res.status(200).send({ msg: "Noticia eliminado exitosamente" });
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al eliminar la noticia", error: error.message });
    }
}

async function addDocuments(req, res) {
    const { posId } = req.params;
    const { documentsIds } = req.body;

    if (!Array.isArray(documentsIds)) {
        return res.status(400).json({ msg: "El cuerpo debe contener un arreglo llamado documentsIds" });
    }

    if (!posId) {
        return res.status(400).send({ msg: "posId no encontrado" });
    }

    try {
        const post = await postRepository.findOne({
            where: { pos_id: posId },
            relations: ["documentos"],
        });

        if (!post) {
            return res.status(404).json({ msg: "Post no encontrado" });
        }

        let nuevosDocumentos = [];

        if (documentsIds.length > 0) {
            nuevosDocumentos = await documentRepository.find({
                where: {
                    doc_id: In(documentsIds),
                },
            });
        }

        // Reemplazar las relaciones del post
        post.documentos = nuevosDocumentos;

        await postRepository.save(post);

        return res.status(200).json({
            msg: "Relaciones actualizadas correctamente",
            documentos: nuevosDocumentos,
        });
    } catch (error) {
        console.error("Error al actualizar documentos del post:", error);
        return res.status(500).json({ msg: "Error interno", error: error.message });
    }
}

async function addImages(req, res) {
    const { posId } = req.params;
    const { imagesIds } = req.body;

    if (!Array.isArray(imagesIds)) {
        return res.status(400).json({ msg: "El cuerpo debe contener un arreglo llamado imagesIds" });
    }

    if (!posId) {
        return res.status(400).send({ msg: "posId no encontrado" });
    }

    try {
        const post = await postRepository.findOne({
            where: { pos_id: posId },
            relations: ["imagenes"],
        });

        if (!post) {
            return res.status(404).json({ msg: "Post no encontrado" });
        }

        let nuevasImagenes = [];

        if (imagesIds.length > 0) {
            nuevasImagenes = await imgGalleryRepository.find({
                where: {
                    gim_id: In(imagesIds),
                },
            });
        }

        // Reemplazar las relaciones del post
        post.imagenes = nuevasImagenes;

        await postRepository.save(post);

        return res.status(200).json({
            msg: "Relaciones actualizadas correctamente",
            imagenes: nuevasImagenes,
        });
    } catch (error) {
        console.error("Error al actualizar imagenes del post:", error);
        return res.status(500).json({ msg: "Error interno", error: error.message });
    }
}

module.exports = {
    getPost,
    getPosts,
    createPost,
    updatePost,
    deletePost,
    addDocuments,
    addImages,
};