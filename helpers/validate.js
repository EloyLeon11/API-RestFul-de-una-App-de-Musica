const validator = require("validator");

const validate = (params) => {

    let resultado = false;

    let name = !validator.isEmpty(params.name) &&
        validator.isAlpha(params.name, "es-ES")


    let nick = !validator.isEmpty(params.nick)


    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email);


    let password = !validator.isEmpty(params.password);


    if (params.surname) {
        let surname = !validator.isEmpty(params.surname) &&
            validator.isAlpha(params.surname, "es-ES")

        if (!surname) {
            throw new Error("No se ha superado la validación por apellido incorrecto");
        } else {
            console.log("Validacion superada en el apellido")
        }
    }

    if (!name || !nick || !email || !password) {
        throw new Error("No se ha superado la validación");
    } else {
        console.log("Validacion superada");
        resultado = true;
    }

    return resultado
}


module.exports = validate