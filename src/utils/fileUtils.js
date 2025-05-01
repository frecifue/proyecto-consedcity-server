const path = require("path");
const fs = require("fs");

/**
 * Funcion para generar rutas dinamicas con año/mes.
 * @param {Object} file - El archivo que se va a guardar.
 * @param {string} folder - El nombre de la carpeta donde se almacenara el archivo (ej. "documentos").
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

    const dateSuffix = new Date().toISOString().replace(/[-:.T]/g, "").slice(0, 14);
    let finalName = `${baseName}_${dateSuffix}${extension}`;
    let finalPath = path.join(absoluteDir, finalName);

    let counter = 1;
    while (fs.existsSync(finalPath)) {
        finalName = `${baseName}_${dateSuffix}_${counter}${extension}`;
        finalPath = path.join(absoluteDir, finalName);
        counter++;
    }

    // 🔄 Cambio aquí: copiar y luego borrar el archivo temporal
    fs.copyFileSync(file.path, finalPath);
    fs.unlinkSync(file.path);

    return path.join(folder, year.toString(), month, finalName).replace(/\\/g, "/");
}

/**
 * Genera la ruta, lo mismo que la anterior pero sin generar año/mes.
 * @param {Object} file - El archivo que se va a guardar.
 * @param {string} folder - El nombre de la carpeta donde se almacenara el archivo.
 * @returns {string} - La ruta relativa para la base de datos.
 */
function generateFilePath(file, folder) {
    const originalName = path.basename(file.originalFilename);
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const relativeDir = path.join("uploads", folder);
    const absoluteDir = path.join(__dirname, "..", "..", relativeDir);

    if (!fs.existsSync(absoluteDir)) {
        fs.mkdirSync(absoluteDir, { recursive: true });
    }

    const dateSuffix = new Date().toISOString().replace(/[-:.T]/g, "").slice(0, 14);
    let finalName = `${baseName}_${dateSuffix}${extension}`;
    let finalPath = path.join(absoluteDir, finalName);

    let counter = 1;
    while (fs.existsSync(finalPath)) {
        finalName = `${baseName}_${dateSuffix}_${counter}${extension}`;
        finalPath = path.join(absoluteDir, finalName);
        counter++;
    }

    // 🔄 Cambio aquí: copiar y luego borrar el archivo temporal
    fs.copyFileSync(file.path, finalPath);
    fs.unlinkSync(file.path);

    return path.join(folder, finalName).replace(/\\/g, "/");
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

/**
 * elimina el archivo temporal. Pensado para cuando el multiparty inserta el archivo pero ocurren errores
 */
function cleanTempFile(file) {
    if (file?.path && fs.existsSync(file.path)) {
        try {
            fs.unlinkSync(file.path);
            console.log("El archivo temporal ha sido eliminado");
        } catch (err) {
            console.error("No se pudo eliminar archivo temporal:", err);
        }
    }
}

module.exports = {
    generateFilePathWithDate,
    generateFilePath,
    deleteFile,
    cleanTempFile
};
