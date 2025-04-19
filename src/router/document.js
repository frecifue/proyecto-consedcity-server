const express = require("express");
const DocumentController = require("../controllers/document");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");
const validateFile = require("../middlewares/validateFile"); // Middleware de validación de archivos

const api = express.Router();
const md_upload = multiparty(); // Usamos multiparty para manejar el multipart/form-data

// Rutas
api.get("/documents", DocumentController.getDocuments);

// Ruta para crear documento, validación para el archivo documento (obligatorio)
api.post("/document", [
    md_auth.asureAuth, 
    md_upload, 
    validateFile({ 
        fieldName: 'documento',  // Campo archivo
        allowedTypes: ['application/pdf'],  // Solo archivos PDF
        maxSizeMB: 15,  // 15MB de tamaño máximo
        required: true  // El archivo es obligatorio al crear
    }), 
    DocumentController.createDocument
]);

// Ruta para actualizar documento, validación para el archivo documento (opcional)
api.patch("/document/:docId", [
    md_auth.asureAuth, 
    md_upload, 
    validateFile({ 
        fieldName: 'documento',  // Campo archivo
        allowedTypes: ['application/pdf'],  // Solo archivos PDF
        maxSizeMB: 15,  // 15MB de tamaño máximo
        required: false  // El archivo no es obligatorio al actualizar
    }), 
    DocumentController.updateDocument
]);

// Ruta para eliminar documento
api.delete("/document/:docId", [md_auth.asureAuth], DocumentController.deleteDocument);

module.exports = api;
