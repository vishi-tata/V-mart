const cloudinary = require("cloudinary")

async function cloudinaryUploadFunction(imagePath,imageTitle) {
    let remoteUrl;
        await cloudinary.uploader.upload(imagePath, function (result) {
            remoteUrl = result.url;
        }, { public_id: imageTitle })
        return remoteUrl;
}

module.exports = cloudinaryUploadFunction;