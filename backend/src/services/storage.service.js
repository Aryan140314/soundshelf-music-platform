const { ImageKit } = require("@imagekit/nodejs")


// Create a reusable ImageKit client with the private key from the environment.
const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function uploadFile(file) {
    // Save uploaded music files in a dedicated ImageKit folder.
    const result = await ImageKitClient.files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder: "yt-complete-backend/music"
    })

    return result;
}


module.exports = { uploadFile }
