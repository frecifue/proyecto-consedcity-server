const express = require("express");
const ImageGalleryController = require("../controllers/image_gallery");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");

const md_upload = multiparty({uploadDir: "./uploads/galeria_imagenes"})
const api = express.Router();

api.get("/images_gallery", ImageGalleryController.getImagesGallery);
api.get("/image_gallery", ImageGalleryController.getImageGallery);
api.post("/image_gallery", [md_auth.asureAuth, md_upload], ImageGalleryController.createImageGallery);
api.patch("/image_gallery/:gimId", [md_auth.asureAuth, md_upload], ImageGalleryController.updateImageGallery);
api.delete("/image_gallery/:gimId", [md_auth.asureAuth], ImageGalleryController.deleteImageGallery);


module.exports = api;