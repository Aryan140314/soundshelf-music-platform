const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service")
const jwt = require("jsonwebtoken");


async function createMusic(req, res) {
    const { title } = req.body;
    const file = req.file;

    // Upload the raw audio buffer to ImageKit and store the returned URL.
    const result = await uploadFile(file.buffer.toString('base64'))

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id,
    })

    res.status(201).json({
        message: "Music created successfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist,
        }
    })

}

async function createAlbum(req, res) {
    const { title, musics } = req.body;

    // Save the album with references to already-created music documents.
    const album = await albumModel.create({
        title,
        artist: req.user.id,
        musics: musics,
    })

    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics,
        }
    })
}

async function getAllMusics(req, res) {
    // Populate artist details so the client can render names without extra requests.
    const musics = await musicModel
        .find()
        .populate("artist", "username email")

    res.status(200).json({
        message: "Musics fetched successfully",
        musics: musics,
    })

}

async function getAllAlbums(req, res) {
    // Return a lighter album list view for dashboards or album browsing pages.
    const albums = await albumModel.find().select("title artist").populate("artist", "username email")

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums,
    })

}

async function getAlbumById(req, res) {
    const albumId = req.params.albumId;

    // Fetch a single album with both the artist and music references expanded.
    const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics")

    return res.status(200).json({
        message: "Album fetched successfully",
        album: album,
    })

}


module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById }
