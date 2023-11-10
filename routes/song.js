// Importar dependencias
const express = require("express");

// Cargar router
const router = express.Router();

// Importar middleware auth

const check = require("../middlewares/auth");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/songs/")
    },
    filename: (req, file, cb) => {
        cb(null, "song-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

// Importar controlador
const songController = require("../controllers/song")

// Definir rutas
router.get("/prueba", songController.prueba)
router.post("/save", check.auth, songController.save)
router.get("/one/:id", check.auth, songController.one)
router.get("/list/:albumId", check.auth, songController.list)
router.put("/update/:id", check.auth, songController.update)
router.delete("/remove/:id", check.auth, songController.remove)
router.post("/upload/:id", [check.auth, uploads.single("file0")], songController.upload)
router.get("/audio/:file", songController.audio)


// Exportar router
module.exports = router;