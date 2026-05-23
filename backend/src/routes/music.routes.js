const express = require('express');
const musicController = require("../controllers/music.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const multer = require('multer');

// Store uploaded files in memory so the controller can forward them to ImageKit.
const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

// Artist-only endpoints for publishing music content.
router.post("/upload", authMiddleware.authArtist, upload.single("music"), musicController.createMusic)
router.post("/album", authMiddleware.authArtist, musicController.createAlbum)

// User-only endpoints for browsing music and album data.
router.get("/", authMiddleware.authUser, musicController.getAllMusics)
router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums)
router.get("/albums/:albumId", authMiddleware.authUser, musicController.getAlbumById)

module.exports = router;
