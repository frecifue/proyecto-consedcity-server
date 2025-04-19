const { cleanTempFile } = require("../utils/fileUtils");

function validateFile({ fieldName = "file", allowedTypes = [], maxSizeMB = 5, required = true } = {}) {
  return (req, res, next) => {
    // Verificar si el archivo está presente en el campo especificado
    const file = req.files?.[fieldName];

    // Si el archivo es requerido pero no existe
    if (required && !file) {
      return res.status(400).json({ msg: `El archivo en el campo ${fieldName} es obligatorio.` });
    }

    // Si el archivo es opcional y no se subió nada, saltamos la validación
    if (!required && !file) {
      return next();
    }

    // Verificamos el tipo de archivo
    if (file && !allowedTypes.includes(file.type)) {
      cleanTempFile(file);
      return res.status(400).json({
        msg: `El archivo tiene un tipo no permitido en el campo ${fieldName}. Tipos permitidos: ${allowedTypes.join(", ")}`,
      });
    }

    // Verificamos el tamaño del archivo
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file && file.size > maxSizeBytes) {
      cleanTempFile(file);
      return res.status(400).json({
        msg: `El archivo excede el tamaño máximo de ${maxSizeMB}MB en el campo ${fieldName}.`,
      });
    }

    next();
  };
}

module.exports = validateFile;
