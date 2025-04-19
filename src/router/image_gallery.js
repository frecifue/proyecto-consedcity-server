const express = require("express");
const ImageGalleryController = require("../controllers/image_gallery");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");
const validateFile = require("../middlewares/validateFile");

const api = express.Router();
const md_upload = multiparty();

// Obtener todas las imágenes
api.get("/images_gallery", ImageGalleryController.getImagesGallery);

// Obtener una sola imagen
api.get("/image_gallery", ImageGalleryController.getImageGallery);

// Crear imagen - archivo requerido
api.post("/image_gallery", [
    md_auth.asureAuth,
    md_upload,
    validateFile({
        fieldName: "imagen",
        allowedTypes: ["image/jpeg", "image/png"],
        maxSizeMB: 5,
        required: true
    }),
    ImageGalleryController.createImageGallery
]);

// Actualizar imagen - archivo opcional
api.patch("/image_gallery/:gimId", [
    md_auth.asureAuth,
    md_upload,
    validateFile({
        fieldName: "imagen",
        allowedTypes: ["image/jpeg", "image/png"],
        maxSizeMB: 5,
        required: false
    }),
    ImageGalleryController.updateImageGallery
]);

// Eliminar imagen
api.delete("/image_gallery/:gimId", [md_auth.asureAuth], ImageGalleryController.deleteImageGallery);

module.exports = api;
