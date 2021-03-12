const cloudinary = require("cloudinary");
const { v4: uuidv4 } = require("uuid");

const {
  CLOUDINARYCLOUDNAME,
  CLOUDINARYAPIKEY,
  CLOUDINARYAPISECRET,
} = require("../config");

cloudinary.config({
  cloud_name: CLOUDINARYCLOUDNAME,
  api_key: CLOUDINARYAPIKEY,
  api_secret: CLOUDINARYAPISECRET,
});

module.exports = {
  uploadToCloudinary: async (stream, folder, imagePublicId) => {
    const options = imagePublicId
      ? { public_id: imagePublicId, overwrite: true }
      : { public_id: `${folder}/${uuid()}` };

    return new Promise((resolve, reject) => {
      const streamLoad = cloudinary.v2.uploader.upload_stream(
        options,
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      stream.pipe(streamLoad);
    });
  },
  deleteFromCloudinary: async (publicId) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(publicId, (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
  },
};
