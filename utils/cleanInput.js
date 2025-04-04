
function trimLowerCase(str){
    return typeof str === "string" ? str.trim().toLowerCase() : "";
}

module.exports = {
    trimLowerCase,
}