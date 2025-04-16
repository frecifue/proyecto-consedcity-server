const { AppDataSource } = require("../data-source");
const { DocumentEntity } = require("../entities/documentos");
const { PostEntity } = require("../entities/post");
const documentPath = require("../utils/documentPath");
const fs = require("fs");
const path = require("path");
const { trimLowerCase } = require("../utils/cleanInput");

const documentRepository = AppDataSource.getRepository(DocumentEntity);
const postRepository = AppDataSource.getRepository(PostEntity);

async function getDocuments(req, res) {
    const { page = "1", limit = "10" } = req.query; // Asegurar valores por defecto como strings
    
    try {
        const pageNumber = parseInt(page, 10); // Convertir a n�mero
        const limitNumber = parseInt(limit, 10); // Convertir a n�mero

        if (isNaN(pageNumber) || isNaN(limitNumber)) {
            return res.status(400).send({ msg: "Los par�metros 'page' y 'limit' deben ser n�meros v�lidos" });
        }

        const skip = (pageNumber - 1) * limitNumber; // C�lculo correcto

        const [documents, total] = await documentRepository.findAndCount({
            skip,
            take: limitNumber,
            order: { doc_created_at: "DESC" },
        });

        return res.status(200).send({
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            limit: limitNumber,
            documents,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al obtener documentos" });
    }
}

async function getDocument(req, res) {
    let { path_doc } = req.params;
    
    path_doc = trimLowerCase(path_doc)

    try {
        const existingDocument = await documentRepository.findOne({ where: { doc_path: path_doc } });

        if(!existingDocument){
            return res.status(400).send({ msg: "No se ha encontrado el documento" });
        }
    
        return res.status(200).send(existingDocument);    
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al obtener el documento" });
    }
}


async function createDocument(req, res) {
    let { titulo, descripcion, path_doc, orden } = req.body;

    titulo = (titulo || "").trim();
    descripcion = (descripcion || "").trim();
    path_doc = trimLowerCase(path_doc);
    orden = parseInt(orden);

    // Validaciones de campos obligatorios
    if (!titulo) {
        return res.status(400).send({ msg: "t�tulo obligatorio" });
    }
    if (!req.files?.documento) {
        return res.status(400).send({ msg: "archivo obligatorio" });
    }
    if (!path_doc) {
        return res.status(400).send({ msg: "ruta obligatoria" });
    }
    if (isNaN(orden)) {
        return res.status(400).send({ msg: "orden obligatorio" });
    }

    try {
        
        const existingDocument = await documentRepository.findOne({ where: { doc_path: path_doc } });
        if (existingDocument) {
            return res.status(400).send({ msg: "La ruta ya est� registrada" });
        }

        const newDocument = documentRepository.create({
            doc_titulo: titulo,
            doc_descripcion: descripcion,
            doc_path: path_doc,
            doc_orden: orden
        });

        if (req.files.documento) {
            const finalPath = documentPath.generateFilePathWithDate(req.files.documento, "documentos"); // Ruta relativa tipo uploads/documents/2025/04/uuid.pdf
            newDocument.doc_documento = finalPath;
        }

        await documentRepository.save(newDocument);

        return res.status(200).send(newDocument);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al crear el documento" });
    }
}

async function updateDocument(req, res) {
    const { docId } = req.params;
    let { titulo, descripcion, path_doc, orden } = req.body;

    if (!docId) {
        return res.status(400).send({ msg: "docId no encontrado" });
    }

    titulo = (titulo || "").trim();
    descripcion = (descripcion || "").trim();
    path_doc = trimLowerCase(path_doc);
    orden = parseInt(orden);

    try {
        const document = await documentRepository.findOne({ where: { doc_id: docId } });

        if (!document) {
            return res.status(404).send({ msg: "Documento no encontrado" });
        }

        // Validaci�n de cambio de ruta
        if (path_doc && path_doc !== document.doc_path) {
            const existingDocument = await documentRepository.findOne({ where: { doc_path: path_doc } });
            if (existingDocument) {
                return res.status(400).send({ msg: "La ruta ya est� registrada" });
            }
            document.doc_path = path_doc;
        }

        // Actualizaci�n de los campos
        if (titulo) document.doc_titulo = titulo;
        if (descripcion) document.doc_descripcion = descripcion;

        // Si se proporciona un nuevo archivo
        if (req.files && req.files.documento) {
            // Eliminar el archivo anterior si existe
            if (document.doc_documento) {
                const oldFilePath = path.join(__dirname, "..", "uploads", document.doc_documento);
                console.log("Ruta del archivo antiguo: ", oldFilePath);  // Verifica la ruta completa
                
                // Verificar si el archivo realmente existe
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath); // Eliminar el archivo viejo
                    console.log("Archivo eliminado exitosamente");
                } else {
                    console.log("El archivo no existe en la ruta: ", oldFilePath);  // Mostrar si no existe
                }
            }

            // Obtener la nueva ruta del archivo con la nueva funci�n
            const finalPath = documentPath.generateFilePathWithDate(req.files.documento, "documentos"); // Ruta relativa tipo documentos/2025/04/uuid.pdf

            // Guardar la nueva ruta en la base de datos
            document.doc_documento = finalPath;
        }

        // Guardar el documento actualizado
        await documentRepository.save(document);

        return res.status(200).send(document);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ msg: "Error al actualizar el documento" });
    }
}

async function deleteDocument(req, res) {
    const { docId } = req.params;

    if (!docId) {
        return res.status(400).send({ msg: "docId no encontrado" });
    }

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const queryDocumentRepository = queryRunner.manager.getRepository("DocumentEntity");
        const queryPostRepository = queryRunner.manager.getRepository("PostEntity");

        // Buscar el documento
        const document = await queryDocumentRepository.findOne({ where: { doc_id: docId } });

        if (!document) {
            await queryRunner.rollbackTransaction();
            return res.status(404).send({ msg: "Documento no encontrado" });
        }

        // Buscar posts que contienen este documento
        const postsWithDocuments = await queryPostRepository
            .createQueryBuilder("post")
            .leftJoin("post.documentos", "documentoFiltro")
            .where("documentoFiltro.doc_id = :docId", { docId })
            .leftJoinAndSelect("post.documentos", "documentoCompleto")
            .getMany();

        for (const post of postsWithDocuments) {
            post.documentos = post.documentos.filter(doc => doc.doc_id !== parseInt(docId));
            await queryPostRepository.save(post);
        }

        // 2. Verificar y eliminar el archivo asociado si existe
        if (document.doc_documento) {
            const filePath = path.join(__dirname, "..", "uploads", document.doc_documento);
            console.log("Ruta del archivo a eliminar: ", filePath); // Verifica la ruta completa

            // Verificar si el archivo realmente existe
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Eliminar el archivo
                console.log("Archivo eliminado exitosamente");
            } else {
                console.log("El archivo no existe en la ruta: ", filePath); // Mostrar si no existe
            }
        }

        // 3. Eliminar el documento de la base de datos
        await queryDocumentRepository.remove(document);

        await queryRunner.commitTransaction();
        return res.status(200).send({ msg: "Documento eliminado correctamente" });
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error(error);
        return res.status(400).send({ msg: "Error al eliminar el documento", error: error.message });
    } finally {
        await queryRunner.release();
    }
}


module.exports = {
    getDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
};