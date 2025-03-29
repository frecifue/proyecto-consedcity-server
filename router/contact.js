// server/routes/contact.js
const express = require('express');
const ContactController = require("../controllers/contact");

const api = express.Router();

// Ruta para manejar el contacto
api.post('/contact', ContactController.contact); // Asociar el controlador con la ruta

module.exports = api;
