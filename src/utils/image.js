function getFilePath(file){
    const filePath = file.path;
    const fileSplit = filePath.split("\\")

    return `${fileSplit[1]}/${fileSplit[2]}/${fileSplit[3]}`;
}

// para las path sin subcarpetas
function getFilePath2(file){
    const filePath = file.path;
    const fileSplit = filePath.split("\\")

    return `${fileSplit[1]}/${fileSplit[2]}`;
}

module.exports = {
    getFilePath,
    getFilePath2,
}