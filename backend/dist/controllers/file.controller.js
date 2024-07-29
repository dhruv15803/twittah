import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadFiles = async (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files))
            return res.status(400).json({ "success": false, "message": "no files available" });
        const urlPromises = req.files.map(async (file) => {
            const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
                resource_type: "auto"
            });
            return cloudinaryResponse.url;
        });
        const urls = await Promise.all(urlPromises);
        res.status(200).json({ "success": true, urls });
        fs.readdir('./Public', (err, files) => {
            if (err)
                throw err;
            for (const file of files) {
                fs.unlink(path.join('./Public', file), (err) => {
                    if (err)
                        throw err;
                });
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "success": false, "message": "Something went wrong when uploading images" });
    }
};
export { uploadFiles, };
