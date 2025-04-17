const express = require("express");
const DocumentController = require("../controllers/document");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");

// Importar el middleware dynamicUploadDir
const dynamicUploadDir = require("../middlewares/dynamicUploadDir");

const api = express.Router();

// Usar dynamicUploadDir para manejar las rutas de carga
const md_upload = multiparty();  // Sin pasar el uploadDir aquí, ya que lo maneja el middleware

// Definir las rutas
api.get("/documents", DocumentController.getDocuments);
api.post("/document", [md_auth.asureAuth, dynamicUploadDir, md_upload], DocumentController.createDocument);
api.patch("/document/:docId", [md_auth.asureAuth, dynamicUploadDir, md_upload], DocumentController.updateDocument);
api.delete("/document/:docId", [md_auth.asureAuth], DocumentController.deleteDocument);

module.exports = api;
