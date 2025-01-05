import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";


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
const upload = multer({ storage })

export const uploadMiddleware = upload.array("documents", 5)