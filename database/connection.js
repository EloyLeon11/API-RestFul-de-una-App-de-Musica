// Importar mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

// Metodo de conexion
const connection = async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/app_musica");

        console.log("Conectado correctamente a la base de datos: app_musica");

    } catch (error) {
        console.log(error);
        throw new Error("No se ha establecido la conexión a la base de datos");
    }
}
// Exportar conexión
module.exports = connection;