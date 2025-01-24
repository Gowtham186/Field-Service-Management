import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

//configuring cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder : "expert-documents",
        allowed_formats : ['pdf', 'jpg', 'png', 'mp4'],
        resource_type : 'auto'
    }
})
//initializing multer with cloudinary storage
export const upload = multer({ storage })