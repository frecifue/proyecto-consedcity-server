/**
 * Valida el formato de un path de proyecto
 * @param {string} path - Path a validar
 * @returns {string|null} - Retorna mensaje de error o null si es válido
 */
function validatePath(path) {
    if (!path || !path.trim()) {
        return "El path es obligatorio";
    }

    const pathRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (!pathRegex.test(path)) {
        return "El path solo puede contener letras minúsculas, números y guiones, sin espacios ni caracteres especiales";
    }

    return null; // Todo OK
}

module.exports = {
    validatePath
}