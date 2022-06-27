const cloudinary = require("cloudinary").v2;

function createCloudinaryConfig(){
    cloudinary.config({
        cloud_name: 'dbytxpekz',
        api_key: '251556716136937',
        api_secret: 'GOdoJvir3UxKy5HSwic5Rrzaa5U',
        secure: true,
    });
}

module.exports = createCloudinaryConfig;