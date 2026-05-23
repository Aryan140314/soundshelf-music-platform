const mongoose = require("mongoose");


// Albums group multiple music records under one artist.
const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    musics: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "music"
    } ],
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
})

const albumModel = mongoose.model("album", albumSchema)


module.exports = albumModel;
