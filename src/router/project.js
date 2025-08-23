const express = require("express");
const ProjectController = require("../controllers/project");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

// Obtener todos los proyectos
api.get("/projects", ProjectController.getProjects);

// Obtener un proyecto específico por su id
api.get("/project/:proId", ProjectController.getProject);

// Crear proyect
api.post("/project", [md_auth.asureAuth, ProjectController.createProject]);

// Agregar documentos al proyecto
api.post("/project/:proId/add-documents", [md_auth.asureAuth], ProjectController.addDocuments);

// Agregar imágenes al proyecto
api.post("/project/:proId/add-images", [md_auth.asureAuth], ProjectController.addImages);

// Agregar posts al proyecto
api.post("/project/:proId/add-posts", [md_auth.asureAuth], ProjectController.addPosts);

// Agregar teams al proyecto
api.post("/project/:proId/add-teams", [md_auth.asureAuth], ProjectController.addTeams);

// Editar proyecto 
api.patch("/project/:proId", [md_auth.asureAuth, ProjectController.updateProject]);

// Eliminar proyecto
api.delete("/project/:proId", [md_auth.asureAuth], ProjectController.deleteProject);

module.exports = api;
