const express = require("express");
const DocumentController = require("../controllers/document");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");

const api = express.Router();
const md_upload = multiparty(); 

// Definir las rutas
api.get("/documents", DocumentController.getDocuments);
api.post("/document", [md_auth.asureAuth, md_upload], DocumentController.createDocument);
api.patch("/document/:docId", [md_auth.asureAuth, md_upload], DocumentController.updateDocument);
api.delete("/document/:docId", [md_auth.asureAuth], DocumentController.deleteDocument);

module.exports = api;
