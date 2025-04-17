const fs = require("fs");
const path = require("path");

// Middleware dinámico para crear subcarpetas por año/mes
const dynamicUploadDir = (req, res, next) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // mes 01-12

    const uploadPath = path.join(__dirname, "../uploads/documentos", year.toString(), month);

    // Crear carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Reemplazar la ruta de `multiparty`
    req.uploadDir = uploadPath;
    next();
};

module.exports = dynamicUploadDir;