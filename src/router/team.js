const express = require("express");
const TeamController = require("../controllers/team");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");
const validateFile = require("../middlewares/validateFile"); // Middleware de validación de archivos

const api = express.Router();
const md_upload = multiparty(); // Usamos multiparty para manejar el multipart/form-data

// Rutas
api.get("/teams", TeamController.getTeams);

// Ruta para crear equipo, validación para el archivo (solo imágenes de hasta 5MB)
api.post("/team", [
    md_auth.asureAuth, 
    md_upload, 
    validateFile({ 
        fieldName: 'foto_perfil', 
        allowedTypes: ['image/jpeg', 'image/png'], 
        maxSizeMB: 5, 
        required: true
    }), 
    TeamController.createTeam
]);

// Ruta para actualizar equipo, validación para el archivo (solo imágenes de hasta 5MB)
api.patch("/team/:equId", [
    md_auth.asureAuth, 
    md_upload, 
    validateFile({ 
        fieldName: 'foto_perfil', 
        allowedTypes: ['image/jpeg', 'image/png'], 
        maxSizeMB: 5, 
        required: false // El archivo no es obligatorio
    }), 
    TeamController.updateTeam
]);

// Ruta para eliminar equipo
api.delete("/team/:equId", [md_auth.asureAuth], TeamController.deleteTeam);

module.exports = api;
