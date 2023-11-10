// Importar dependencias
const jwt = require("jwt-simple")
const moment = require("moment")

// Clave secreta
const secret = "CLAVE_SECRETA_DE_MI_PROYECTO_DE_LA_API_Musical_389291194";

// Crear funcion para generar tokens
const createToken = (user) => {

    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };

    // Devolver token
    return jwt.encode(payload, secret)
}

module.exports = {
    secret,
    createToken
};