const express = require("express");
const cors = require("cors");
const { API_VERSION } = require("./constants");

const app = express();

// import routings
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");
const menuRoutes = require("./router/menu");
const generalInfoRoutes = require("./router/general_information");
const postRoutes = require("./router/post");
const teamRoutes = require("./router/team");
const contactRoutes = require("./router/contact");

// ?? Middlewares
app.use(express.json()); // Reemplaza body-parser.json()
app.use(express.urlencoded({ extended: true })); // Reemplaza body-parser.urlencoded()

// configure static folder
app.use(express.static("uploads"));

// ?? Configurar CORS
app.use(cors());

// ?? Importar y configurar rutas (descomenta y agrega las tuyas)
// const userRoutes = require("./routes/user");
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, generalInfoRoutes);
app.use(`/api/${API_VERSION}`, postRoutes);
app.use(`/api/${API_VERSION}`, teamRoutes);
app.use(`/api/${API_VERSION}`, contactRoutes);

// ?? Mensaje de bienvenida
app.get("/", (req, res) => {
    res.send("?? Bienvenido a la API REST de Proyecto Consedcity");
});

module.exports = app;
