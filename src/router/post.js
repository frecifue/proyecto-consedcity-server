const express = require("express");
const PostController = require("../controllers/post");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");
const validateFile = require("../middlewares/validateFile");

const api = express.Router();
const md_upload = multiparty();

// Obtener todos los posts
api.get("/posts", PostController.getPosts);

// Obtener un post específico por su path
api.get("/post/:path", PostController.getPost);

// Crear post (img_principal requerido)
api.post("/post", [
    md_auth.asureAuth,
    md_upload,
    validateFile({
        fieldName: "img_principal",
        allowedTypes: ["image/jpeg", "image/png"],
        maxSizeMB: 5,
        required: true
    }),
    PostController.createPost
]);

// Agregar documentos al post
api.post("/post/:posId/add-documents", [md_auth.asureAuth], PostController.addDocuments);

// Agregar imágenes al post
api.post("/post/:posId/add-images", [md_auth.asureAuth], PostController.addImages);

// Editar post (img_principal opcional)
api.patch("/post/:posId", [
    md_auth.asureAuth,
    md_upload,
    validateFile({
        fieldName: "img_principal",
        allowedTypes: ["image/jpeg", "image/png"],
        maxSizeMB: 5,
        required: false
    }),
    PostController.updatePost
]);

// Eliminar post
api.delete("/post/:posId", [md_auth.asureAuth], PostController.deletePost);

module.exports = api;
