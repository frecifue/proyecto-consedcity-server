const { In } = require("typeorm");
const { AppDataSource } = require("../data-source");
const { ProjectEntity } = require("../entities/proyecto"); 
const { PostEntity } = require("../entities/post");  
const { DocumentEntity } = require("../entities/documentos"); 
const { GaleriaImagenesEntity } = require("../entities/galeria_imagenes"); 
const { EquipoEntity } = require("../entities/equipo"); 
const { trimLowerCase } = require("../utils/cleanInput");
const {validatePath} = require("../utils/validatePath");

const projectRepository = AppDataSource.getRepository(ProjectEntity);

const postRepository = AppDataSource.getRepository(PostEntity);
const imgGalleryRepository = AppDataSource.getRepository(GaleriaImagenesEntity);
const documentRepository = AppDataSource.getRepository(DocumentEntity);
const teamRepository = AppDataSource.getRepository(EquipoEntity);


async function getProjects(req, res) {
    const { page = "1", limit = "10" } = req.query; // Asegurar valores por defecto como strings

    try {
        const pageNumber = parseInt(page, 10); // Convertir a numero
        const limitNumber = parseInt(limit, 10); // Convertir a numero

        if (isNaN(pageNumber) || isNaN(limitNumber)) {
            return res.status(400).send({ msg: "Los parametros 'page' y 'limit' deben ser números válidos" });
        }

        const skip = (pageNumber - 1) * limitNumber; // Calculo correcto
        const [projects, total] = await projectRepository.findAndCount({
            skip,
            take: limitNumber,
            order: { pro_orden: "ASC" },
            relations: ["posts", "documentos", "imagenes", "equipos" ],
        });

        return res.status(200).send({
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            limit: limitNumber,
            projects,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al obtener el proyecto" });
    }
}

async function getProject(req, res) {
    const { path } = req.params;
    
    try {
        const existingProject = await projectRepository.findOne({ 
            where: { pro_path: path.toLowerCase() },
            relations: ["posts", "documentos", "imagenes", "equipos" ],
        });

        if(!existingProject){
            return res.status(400).send({ msg: "No se ha encontrado ningun proyecto" });
        }
    
        return res.status(200).send(existingProject);    
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al obtener el proyecto" });
    }
}

async function createProject(req, res) {
    let { nombre, descripcion, anio, descripcion_corta, orden, path } = req.body;

    nombre = (nombre || "").trim();
    descripcion = (descripcion || "").trim();
    descripcion_corta = (descripcion_corta || "").trim();
    path = (path || "").trim();
    anio = parseInt(anio, 10);
    orden = parseInt(orden, 10);

    // Validaciones obligatorias
    if (!nombre || !descripcion || !descripcion_corta || !path || isNaN(anio) || isNaN(orden)) {
        return res.status(400).send({ 
            msg: "nombre, descripción, año, descripción corta, orden y path son obligatorios" 
        });
    }

    // Validar año
    const currentYear = new Date().getFullYear();
    if (anio < 1900 || anio > currentYear + 1) {
        return res.status(400).send({ msg: "El año no es válido" });
    }

    // Validar formato del path
    const pathError = validatePath(path);
    if (pathError) return res.status(400).send({ msg: pathError });

    try {
        // Verificar si el path ya existe
        const existingProject = await projectRepository.findOne({ where: { pro_path: path } });

        if (existingProject) {
            return res.status(400).send({ msg: "El path ya está registrado" });
        }

        const newProject = projectRepository.create({
            pro_nombre: nombre,
            pro_descripcion: descripcion,
            pro_desc_corta: descripcion_corta,
            pro_anio: anio,
            pro_orden: orden,
            pro_path: path
        });

        await projectRepository.save(newProject);

        return res.status(200).send(newProject);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Error al crear el proyecto" });
    }
}

async function updateProject(req, res) {
    const { proId } = req.params;
    let { nombre, descripcion, anio, descripcion_corta, orden, path } = req.body;

    if (!proId) return res.status(400).send({ msg: "proId no encontrado" });

    nombre = (nombre || "").trim();
    descripcion = (descripcion || "").trim();
    descripcion_corta = (descripcion_corta || "").trim();
    path = (path || "").trim();
    anio = anio ? parseInt(anio, 10) : null;
    orden = orden !== undefined ? parseInt(orden, 10) : null;

    // Validar año si viene
    if (anio !== null) {
        const currentYear = new Date().getFullYear();
        if (isNaN(anio) || anio < 1900 || anio > currentYear + 1) {
            return res.status(400).send({ msg: "El año no es válido" });
        }
    }

    // Validar formato del path si viene
    if (path) {
        const pathError = validatePath(path);
        if (pathError) return res.status(400).send({ msg: pathError });
    }

    try {
        const project = await projectRepository.findOne({ where: { pro_id: proId } });
        if (!project) return res.status(404).send({ msg: "Proyecto no encontrado" });

        // Verificar unicidad del path en BD
        if (path) {
            const existingProject = await projectRepository.findOne({ where: { pro_path: path } });
            if (existingProject && existingProject.pro_id !== parseInt(proId)) {
                return res.status(400).send({ msg: "El path ya está registrado" });
            }
        }

        // Actualizar campos
        if (nombre) project.pro_nombre = nombre;
        if (descripcion) project.pro_descripcion = descripcion;
        if (descripcion_corta) project.pro_desc_corta = descripcion_corta;
        if (anio !== null) project.pro_anio = anio;
        if (orden !== null && !isNaN(orden)) project.pro_orden = orden;
        if (path) project.pro_path = path;

        await projectRepository.save(project);
        return res.status(200).send(project);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Error al actualizar el proyecto" });
    }
}



async function deleteProject(req, res) {
    const { proId } = req.params;

    if (!proId) {
        return res.status(400).send({ msg: "proId no encontrado" });
    }

    try {
        // Verificar si el proyecto existe
        const project = await projectRepository.findOne({ where: { pro_id: proId } });

        if (!project) {
            return res.status(404).send({ msg: "Proyecto no encontrado" });
        }

        // Eliminar el proyecto
        await projectRepository.remove(project); // Usar el metodo remove del repositorio

        return res.status(200).send({ msg: "Proyecto eliminado exitosamente" });
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al eliminar el proyecto", error: error.message });
    }
}

async function addDocuments(req, res) {
    const { proId } = req.params;
    const { documentsIds } = req.body;

    if (!Array.isArray(documentsIds)) {
        return res.status(400).json({ msg: "El cuerpo debe contener un arreglo llamado documentsIds" });
    }

    if (!proId) {
        return res.status(400).send({ msg: "proId no encontrado" });
    }

    try {
        const project = await projectRepository.findOne({
            where: { pro_id: proId },
            relations: ["documentos"],
        });

        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        let nuevosDocumentos = [];

        if (documentsIds.length > 0) {
            nuevosDocumentos = await documentRepository.find({
                where: {
                    doc_id: In(documentsIds),
                },
            });
        }

        // Reemplazar las relaciones del proyecto
        project.documentos = nuevosDocumentos;

        await projectRepository.save(project);

        return res.status(200).json({
            msg: "Relaciones actualizadas correctamente",
            documentos: nuevosDocumentos,
        });
    } catch (error) {
        console.error("Error al actualizar documentos del proyecto:", error);
        return res.status(500).json({ msg: "Error interno", error: error.message });
    }
}

async function addImages(req, res) {
    const { proId } = req.params;
    const { imagesIds } = req.body;

    if (!Array.isArray(imagesIds)) {
        return res.status(400).json({ msg: "El cuerpo debe contener un arreglo llamado imagesIds" });
    }

    if (!proId) {
        return res.status(400).send({ msg: "proId no encontrado" });
    }

    try {
        const project = await projectRepository.findOne({
            where: { pro_id: proId },
            relations: ["imagenes"],
        });

        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        let nuevasImagenes = [];

        if (imagesIds.length > 0) {
            nuevasImagenes = await imgGalleryRepository.find({
                where: {
                    gim_id: In(imagesIds),
                },
            });
        }

        // Reemplazar las relaciones del proyecto
        project.imagenes = nuevasImagenes;

        await projectRepository.save(project);

        return res.status(200).json({
            msg: "Relaciones actualizadas correctamente",
            imagenes: nuevasImagenes,
        });
    } catch (error) {
        console.error("Error al actualizar imagenes del proyecto:", error);
        return res.status(500).json({ msg: "Error interno", error: error.message });
    }
}

async function addPosts(req, res) {
    const { proId } = req.params;
    const { postsIds } = req.body;

    if (!Array.isArray(postsIds)) {
        return res.status(400).json({ msg: "El cuerpo debe contener un arreglo llamado postsIds" });
    }

    if (!proId) {
        return res.status(400).send({ msg: "proId no encontrado" });
    }

    try {
        const project = await projectRepository.findOne({
            where: { pro_id: proId },
            relations: ["posts"],
        });

        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        let nuevosPosts = [];

        if (postsIds.length > 0) {
            nuevosPosts = await postRepository.find({
                where: {
                    pos_id: In(postsIds),
                },
            });
        }

        // Reemplazar las relaciones del proyecto
        project.posts = nuevosPosts;

        await projectRepository.save(project);

        return res.status(200).json({
            msg: "Relaciones actualizadas correctamente",
            posts: nuevosPosts,
        });
    } catch (error) {
        console.error("Error al actualizar noticias del proyecto:", error);
        return res.status(500).json({ msg: "Error interno", error: error.message });
    }
}

async function addTeams(req, res) {
    const { proId } = req.params;
    const { teamsIds } = req.body;

    if (!Array.isArray(teamsIds)) {
        return res.status(400).json({ msg: "El cuerpo debe contener un arreglo llamado teamsIds" });
    }

    if (!proId) {
        return res.status(400).send({ msg: "proId no encontrado" });
    }

    try {
        const project = await projectRepository.findOne({
            where: { pro_id: proId },
            relations: ["equipos"],
        });

        if (!project) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        let nuevosTeams = [];

        if (teamsIds.length > 0) {
            nuevosTeams = await teamRepository.find({
                where: {
                    equ_id: In(teamsIds),
                },
            });
        }

        // Reemplazar las relaciones del proyecto
        project.equipos = nuevosTeams;

        await projectRepository.save(project);

        return res.status(200).json({
            msg: "Relaciones actualizadas correctamente",
            equipos: nuevosTeams,
        });
    } catch (error) {
        console.error("Error al actualizar equipos del proyecto:", error);
        return res.status(500).json({ msg: "Error interno", error: error.message });
    }
}

module.exports = {
    getProject,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    addDocuments,
    addImages,
    addPosts,
    addTeams
};