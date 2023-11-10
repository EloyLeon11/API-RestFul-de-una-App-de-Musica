const Song = require("../models/song")
const fs = require("fs");
const path = require("path")

// accion de prueba
const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/song.js"
    })
}


const save = (req, res) => {
    // Recoger los datos que me llegan 
    let params = req.body;

    // Crear un objeto con mi modelo
    let song = new Song(params);

    // Guardado

    song.save((error, songStored) => {
        if (error || !songStored) {

            return res.status(500).send({
                status: "error",
                message: "La cancion no se ha guardado",
                error
            })
        }
        return res.status(200).send({
            status: "success",
            song: songStored
        })
    })
}


const one = (req, res) => {

    let songId = req.params.id;

    Song.findById(songId).populate("album").exec((error, song) => {

        if (error || !song) {
            return res.status(404).send({
                status: "error",
                message: "La canción no existe",
            });
        }
        return res.status(200).send({
            status: "success",
            song
        });
    })
}


const list = (req, res) => {
    // recoger id de album
    let albumId = req.params.albumId;

    // hacer consulta
    Song.find({ album: albumId })
        .populate({
            path: "album",
            populate: {
                path: "artist",
                model: "artist"
            }
        })

        .sort("track").exec((error, songs) => {
            if (error || !songs) {
                return res.status(200).send({
                    status: "error",
                    message: "No hay canciones"
                });
            }
            return res.status(200).send({
                status: "succes",
                songs
            });
        });
}


const update = (req, res) => {

    // parametro url id de cancion

    let songId = req.params.id

    // Datos para guardar

    let data = req.body

    // Busqueda y actualización

    Song.findByIdAndUpdate(songId, data, { new: true }, (error, songUpdated) => {

        if (error || !songUpdated) {
            return res.status(500).send({
                status: "error",
                message: "La canción no se ha actualizado"
            });
        }

        return res.status(200).send({
            status: "succes",
            song: songUpdated
        });
    });
}


const remove = (req, res) => {

    const songId = req.params.id;

    Song.findByIdAndRemove(songId, (error, songRemoved) => {

        if (error || !songRemoved) {
            return res.status(500).send({
                status: "error",
                message: "No se ha borrado la cancion"
            });
        }
        return res.status(200).send({
            status: "success",
            song: songRemoved
        });
    });
}


const upload = (req, res) => {

    // Recoger album id
    let songId = req.params.id

    // Recoger fichero de imagen y comprobar si existe
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "La petición no incluye la imagen"
        });
    }

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacar info de la imagen
    const imageSplit = image.split("\.");
    const extension = imageSplit[1]

    // Comprobar si la extension es valida
    if (extension != "mp3" && extension != "ogg") {
        // Borrar archivo
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        return res.status(404).send({
            status: "error",
            message: "La extension no es válida"
        });
    }

    // Si es correcto, guardar la imagen en la base de datos

    Song.findOneAndUpdate({ _id: songId }, { file: req.file.filename }, { new: true }, (error, songUpDated) => {

        if (error || !songUpDated) {
            return res.status(500).send({
                status: "error",
                message: "Error en la subida"
            });
        }
        return res.status(200).send({
            status: "success",
            song: songUpDated,
            file: req.file
        });
    });
}


const audio = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/songs/" + file;

    // Comprobar que existe el fichero
    fs.stat(filePath, (error, exists) => {

        if (error || !exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            });
        }
        return res.sendFile(path.resolve(filePath))
    })
}

module.exports = {
    prueba,
    save,
    one,
    list,
    update,
    remove,
    upload,
    audio
}