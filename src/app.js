const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { API_VERSION } = require("./constants");

const app = express();

// Seguridad HTTP
// app.use(helmet({
//   crossOriginEmbedderPolicy: false,
//   contentSecurityPolicy: false, // o personaliza si quieres más control
// }));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// cors

// Obtener los orígenes permitidos desde las variables de entorno
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  process.env.BACKEND_URL 
];


// app.use(cors({
//   origin: function(origin, callback) {
//     // Si no hay origen (es una solicitud desde el backend, por ejemplo), permite
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       return callback(null, true);
//     }
//     return callback(new Error('No permitido por CORS'), false);
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // Si estás usando cookies o autenticación
// }));
app.use(cors());

// Carpeta estática
app.use(express.static("uploads"));

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
