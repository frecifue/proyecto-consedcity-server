const jwt = require("jsonwebtoken")
const {JWT_SECRET_KEY} = require("../constants");

function createAccessToken(user){
    const expToken = new Date();
    expToken.setHours(expToken.getHours() + 12);

    const payload = {
        token_type: "access",
        usu_id: user.usu_id,
        iat: Date.now(),
        exp: expToken.getTime(),
    };

    return jwt.sign(payload, JWT_SECRET_KEY);
}

function createRefreshToken(user){
    const expToken = new Date();
    expToken.getMonth(expToken.getMonth() + 1);

    const payload = {
        token_type: "refresh",
        usu_id: user.usu_id,
        iat: Date.now(),
        exp: expToken.getTime(),
    };

    return jwt.sign(payload, JWT_SECRET_KEY);
}

function decoded(token){
    return jwt.decode(token, JWT_SECRET_KEY, true);
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    decoded,
}