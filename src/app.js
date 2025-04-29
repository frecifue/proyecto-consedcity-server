const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { API_VERSION } = require("./constants");

const app = express();

// Seguridad HTTP
app.use(helmet());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Carpeta estática
app.use("/uploads", express.static("uploads"));

// Rutas
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");
const menuRoutes = require("./router/menu");
const generalInfoRoutes = require("./router/general_information");
const postRoutes = require("./router/post");
const teamRoutes = require("./router/team");
const contactRoutes = require("./router/contact");
const imageGalleryRoutes = require("./router/image_gallery");
const documentRoutes = require("./router/document");
const typeUserRoutes = require("./router/type_user");

app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, generalInfoRoutes);
app.use(`/api/${API_VERSION}`, postRoutes);
app.use(`/api/${API_VERSION}`, teamRoutes);
app.use(`/api/${API_VERSION}`, contactRoutes);
app.use(`/api/${API_VERSION}`, imageGalleryRoutes);
app.use(`/api/${API_VERSION}`, documentRoutes);
app.use(`/api/${API_VERSION}`, typeUserRoutes);

// Ruta raíz
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.send("Bienvenido a la API REST de Proyecto Consedcity");
  });
}

// Middleware de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

module.exports = app;
