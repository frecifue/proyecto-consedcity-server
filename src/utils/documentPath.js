// utils/filePath.js (o el archivo que uses)

const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

/**
 * Función para generar rutas dinámicas con año/mes y nombre de archivo único.
 * @param {Object} file - El archivo que se va a guardar.
 * @param {string} folder - El nombre de la carpeta donde se almacenará el archivo (ej. "documentos").
 * @returns {string} - La ruta relativa para la base de datos.
 */
function generateFilePathWithDate(file, folder) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const extension = path.extname(file.originalFilename);
    const uniqueName = `${uuidv4()}${extension}`;

    // Ruta relativa donde se almacenará el archivo
    const relativeDir = path.join("uploads", folder, year.toString(), month);
    const absoluteDir = path.join(__dirname, "..", "..", relativeDir);

    if (!fs.existsSync(absoluteDir)) {
        fs.mkdirSync(absoluteDir, { recursive: true });
    }

    const finalPath = path.join(absoluteDir, uniqueName);
    fs.renameSync(file.path, finalPath);

    // Regresamos la ruta relativa para la base de datos sin el prefijo "uploads/"
    return path.join(folder, year.toString(), month, uniqueName).replace(/\\/g, "/");
}

module.exports = {
    generateFilePathWithDate,
};
