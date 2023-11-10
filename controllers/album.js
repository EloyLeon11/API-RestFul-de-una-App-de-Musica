const Album = require("../models/album")
const fs = require("fs");
const path = require("path");
const Song = require("../models/song")

// accion de prueba
const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/album.js"
    })
}

const save = (req, res) => {

    // Sacar datos enviados en el body
    let params = req.body;

    // Crear objeto
    let album = new Album(params)

    // Guardar objeto
    album.save((error, albumStored) => {

        if (error || !albumStored) {
            return res.status(500).send({
                status: "ERROR",
                message: "Error al guardar el album"
            })
        }
        return res.status(200).send({
            status: "success",
            message: "Mensaje enviado desde: controllers/album.js",
            album: albumStored
        })
    })
}


const one = (req, res) => {
    // Sacar el id del album
    const albumId = req.params.id;

    // Find y popular info del artista
    Album.findById(albumId).populate("artist").exec((error, album) => {
        if (error || !album) {
            return res.status(404).send({
                status: "ERROR",
                message: "No se ha encontrado el album"

            })
        }
        return res.status(200).send({
            status: "success",
            album
        })
    })
}


const list = (req, res) => {
    // Sacar el id del artista de la url
    const artistId = req.params.artistId

    // Sacar todos los albums de la base de datos de un artista en concreto
    if (!artistId) {
        return res.status(404200).send({
            status: "error",
            message: "No se ha encontrado el artista"
        })
    }

    Album.find({ artist: artistId }).populate("artist").exec((error, albums) => {

        if (error || !albums) {
            return res.status(404).send({
                status: "error",
                message: "No se ha encontrado albums"
            });
        }
        return res.status(200).send({
            status: "success",
            albums
        });
    });
}

const update = (req, res) => {

    // Recoger param url
    const albumId = req.params.albumId;

    // Recoger el body
    const data = req.body;

    // Find y un update

    Album.findByIdAndUpdate(albumId, data, { new: true }, (error, albumUpDated) => {

        if (error || !albumUpDated) {

            return res.status(200).send({
                status: "error",
                message: "No se ha actualizado el album",
            });
        }

        return res.status(200).send({
            status: "success",
            album: albumUpDated
        })
    });
}


const upload = (req, res) => {

    // Recoger album id
    let albumId = req.params.id

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
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
        // Borrar archivo
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        return res.status(404).send({
            status: "error",
            message: "La extension no es válida"
        });
    }

    // Si es correcto, guardar la imagen en la base de datos

    Album.findOneAndUpdate({ _id: albumId }, { image: req.file.filename }, { new: true }, (error, albumUpDated) => {

        if (error || !albumUpDated) {
            return res.status(500).send({
                status: "error",
                message: "Error en la subida"
            });
        }

        return res.status(200).send({
            status: "success",
            album: albumUpDated,
            file: req.file
        });
    });
}


const image = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/albums/" + file;

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


const remove = async (req, res) => {

    // Sacar el id del artista de la url
    const albumId = req.params.id;

    // Hacer consulta para buscar y eliminar el artista con un await
    try {

        const albumRemoved = await Album.findById(albumId).remove();
        const songsRemoved = await Song.find({ album: albumId }).remove();

        return res.status(200).send({
            status: "succes",
            message: "metodo borrado artista",
            albumRemoved,
            songsRemoved

        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar el artista o alguno de sus elementos",
            error
        });
    }
}

module.exports = {
    prueba,
    save,
    one,
    list,
    update,
    upload,
    image,
    remove
}