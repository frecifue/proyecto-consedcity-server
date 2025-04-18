// utils/filePath.js (o el archivo que uses)

const path = require("path");
const fs = require("fs");

/**
 * Función para generar rutas dinámicas con año/mes.
 * @param {Object} file - El archivo que se va a guardar.
 * @param {string} folder - El nombre de la carpeta donde se almacenará el archivo (ej. "documentos").
 * @returns {string} - La ruta relativa para la base de datos.
 */
function generateFilePathWithDate(file, folder) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");

    const originalName = path.basename(file.originalFilename);
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const relativeDir = path.join("uploads", folder, year.toString(), month);
    const absoluteDir = path.join(__dirname, "..", "..", relativeDir);

    if (!fs.existsSync(absoluteDir)) {
        fs.mkdirSync(absoluteDir, { recursive: true });
    }

    let finalName = `${baseName}${extension}`;
    let finalPath = path.join(absoluteDir, finalName);
    let counter = 1;

    // Verifica si el archivo ya existe y le agrega un sufijo numérico si es necesario
    while (fs.existsSync(finalPath)) {
        finalName = `${baseName}_${counter}${extension}`;
        finalPath = path.join(absoluteDir, finalName);
        counter++;
    }

    fs.renameSync(file.path, finalPath);

    return path.join(folder, year.toString(), month, finalName).replace(/\\/g, "/");
}

/** 
 * Genera la ruta, lo mismo que la anterior pero sin generar año/mes
*/
function generateFilePath(file, folder) {
    const originalName = path.basename(file.originalFilename);
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const relativeDir = path.join("uploads", folder); // Ruta base sin año ni mes
    const absoluteDir = path.join(__dirname, "..", "..", relativeDir);

    if (!fs.existsSync(absoluteDir)) {
        fs.mkdirSync(absoluteDir, { recursive: true });
    }

    let finalName = `${baseName}${extension}`;
    let finalPath = path.join(absoluteDir, finalName);
    let counter = 1;

    // Verifica si el archivo ya existe y le agrega un sufijo numérico si es necesario
    while (fs.existsSync(finalPath)) {
        finalName = `${baseName}_${counter}${extension}`;
        finalPath = path.join(absoluteDir, finalName);
        counter++;
    }

    fs.renameSync(file.path, finalPath);

    return path.join(folder, finalName).replace(/\\/g, "/"); // Regresa la ruta relativa sin año ni mes
}


/**
 * Obtiene una ruta relativa corta desde el path del archivo subido (con multiparty).
 */
function getFilePath(file) {
    const filePath = file.path;
    const fileSplit = filePath.split(/[\\/]/); // compatible con Windows y Linux
    return `${fileSplit[fileSplit.length - 3]}/${fileSplit[fileSplit.length - 2]}/${fileSplit[fileSplit.length - 1]}`;
}

/**
 * Elimina un archivo desde su ruta relativa (sin el prefijo 'uploads/').
 */
function deleteFile(relativePath) {
    const absolutePath = path.join(__dirname, "..", "..", "uploads", relativePath);
    if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log(`Archivo eliminado: ${relativePath}`);
    } else {
        console.warn(`Archivo no encontrado para eliminar: ${relativePath}`);
    }
}


module.exports = {
    generateFilePathWithDate,
    generateFilePath,
    getFilePath,
    deleteFile
};
