import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadContent = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        console.log("file is uploaded on cloudinary", response.url);

        // Delete after successful upload
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.error("Cloudinary upload error:", error);
        return null;
    }
}
export { uploadContent };