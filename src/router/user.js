const express = require("express");
const UserController = require("../controllers/user");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");
const validateFile = require("../middlewares/validateFile"); // Middleware de validación de archivos

const api = express.Router();
const md_upload = multiparty(); // Usamos multiparty para manejar el multipart/form-data

// Rutas
api.get("/user/me", [md_auth.asureAuth], UserController.getMe);
api.get("/users", [md_auth.asureAuth], UserController.getUsers);

// Ruta para crear usuario, validación para el archivo avatar (opcional)
api.post("/user", [
    md_auth.asureAuth, 
    md_upload, 
    validateFile({ 
        fieldName: 'avatar', 
        allowedTypes: ['image/jpeg', 'image/png'], 
        maxSizeMB: 5, 
        required: false // El avatar es opcional
    }), 
    UserController.createUser
]);

// Ruta para actualizar usuario, validación para el archivo avatar (opcional)
api.patch("/user/:userId", [
    md_auth.asureAuth, 
    md_upload, 
    validateFile({ 
        fieldName: 'avatar', 
        allowedTypes: ['image/jpeg', 'image/png'], 
        maxSizeMB: 5, 
        required: false // El avatar es opcional
    }), 
    UserController.updateUser
]);

// Ruta para eliminar usuario
api.delete("/user/:userId", [md_auth.asureAuth], UserController.deleteUser);

module.exports = api;
