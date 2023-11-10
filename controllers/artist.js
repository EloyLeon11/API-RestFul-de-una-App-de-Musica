const Artist = require("../models/artist");
const fs = require("fs");
const path = require("path");
const Album = require("../models/album")


// accion de prueba
const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/artist.js"
    })
}

// accion guardar artista

const save = (req, res) => {

    // Recoger datos del body
    let params = req.body;

    // Crear el objeto a guardar
    let artist = new Artist(params);

    // Guardarlo
    artist.save((error, artistStored) => {
        if (error || !artistStored) {
            return res.status(400).send({
                status: "error",
                message: "No se ha guardado el artista",
            });
        }

        return res.status(200).send({
            status: "success",
            artist: artistStored
        });
    })

    return res.status(200).send({
        status: "success",
        message: "Menaje de accion guardar artista",
        artist
    });
}


const one = (req, res) => {

    // Sacar un parametro por url
    const artistId = req.params.id

    // Find
    artist.findById(artistId, (error, artist) => {

        if (error || !artist) {

            return res.status(404).send({
                status: "error",
                message: "No existe el artista"
            });
        }
        return res.status(200).send({
            status: "success",
            artist
        });
    });
}


const list = (req, res) => {

    // sacar la posible pagina
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    // Definir numero de elementos por page
    const itemsPerPage = 5;

    // Find, ordenarlo y paginarlo
    artist.find()
        .sort("name")
        .paginate(page, itemsPerPage, (error, artists, total) => {
            if (error || !artists) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay artistas"
                });
            }
            return res.status(200).send({
                status: "success",
                page,
                itemsPerPage,
                total,
                artists
            });
        })
}


const update = (req, res) => {
    // Recoger id artista url
    const id = req.params.id;

    // Recoger datos body
    const data = req.body;

    // Buscar y actualizar artista
    artist.findByIdAndUpdate(id, data, { new: true }, (error, artistUpdated) => {

        if (error || !artistUpdated) {
            return res.status(500).send({
                status: "error",
                message: "No se ha actualizado el artista"
            });
        }
        return res.status(200).send({
            status: "succes",
            artist: artistUpdated
        });
    });
    return res.status(200).send({
        status: "succes",
        message: "Metodo update artists"
    });
}


const remove = async (req, res) => {
    // Sacar el id del artista de la url
    const artistId = req.params.id;

    // Hacer consulta para buscar y eliminar el artista con un await
    try {

        const artistRemoved = await artist.findByIdAndDelete(artistId)
        const albumRemoved = await Album.find({ artist: artistId });

        albumRemoved.forEach(async (album) => {

            const songRemoved = await Song.find({ album: album._id }).remove();
            album.remove()
        })
        return res.status(200).send({
            status: "succes",
            message: "metodo borrado artista",
            artistRemoved
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar el artista o alguno de sus elementos",
            error
        });
    }
}


const upload = (req, res) => {

    // Configuracion de subida (multer)

    // Recoger artist id
    let artistId = req.params.id

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

    artist.findOneAndUpdate({ _id: artistId }, { image: req.file.filename }, { new: true }, (error, artistUpdated) => {
        if (error || !artistUpdated) {
            return res.status(500).send({
                status: "error",
                message: "Error en la subida"
            });
        }
        return res.status(200).send({
            status: "success",
            artist: artistUpdated,
            file: req.file
        });
    });
}


const image = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/artists/" + file;

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
    image
}