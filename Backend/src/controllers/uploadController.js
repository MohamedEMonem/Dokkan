const multer = require('multer');
const minioClient = require('../../minio.config.js');
const storage = multer.memoryStorage();
// const {prisma} =require("../prisma/client.js")
const { sendSuccess, sendError } = require('../utils/response');


const upload = multer({
    storage: storage, fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error("Only image files are allowed"));
        }
        else if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
            cb(new Error("Only JPEG, PNG, and GIF files are allowed"));
        }

        cb(null, true);
    }
    , limits: { fileSize: 5 * 1024 * 1024 }


});

const setupBucket = async (bucketName) => {

    try {
        // 1. Check if the bucket exists, create it if it doesn't
        // const exists = await minioClient.bucketExists(bucketName);
        // if (!exists) {
        await minioClient.makeBucket(bucketName);
        console.log(`Bucket '${bucketName}' created successfully.`);
        // }

        // 2. Define a public read-only policy (Standard S3 Policy format)
        const publicReadPolicy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: ["s3:GetObject"], // Allows downloading/viewing files
                    Effect: "Allow",
                    Principal: "*", // Allows ANYONE (public)
                    Resource: [`arn:aws:s3:::${bucketName}/*`], // Applies to all files in this bucket
                },
            ],
        };

        // 3. Apply the policy to the bucket
        await minioClient.setBucketPolicy(bucketName, JSON.stringify(publicReadPolicy));
        console.log(`Bucket '${bucketName}' access policy set to Public Read.`);

    } catch (error) {
        console.error("Error configuring MinIO bucket:", error);
    }
};

const productImgUploadHandler = async (req, res, next) => {

    try {
        const img = req.file
        if (!img) {
            console.log("No file uploaded");
            
            
            return next();}

        const bucketName = "essam-products";
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await setupBucket(bucketName);
        }




        const objectName = `${Date.now()}-${img.originalname}`;
        const cleanObjectName = objectName.replace(/\s+/g, '-'); // Replace spaces with dashes
        await minioClient.putObject(bucketName, cleanObjectName, img.buffer, img.size, { "Content-Type": img.mimetype });

        const imageUrl = `http://localhost:9000/${bucketName}/${cleanObjectName}`;

        req.images = [{ imageUrl, sortOrder: 0 }];
        req.uploadedObjectName = cleanObjectName;
        console.log("Image uploaded successfully:", imageUrl);
        console.log("Object name:", cleanObjectName);

        // return sendSuccess(res, { imageUrl,objectName }, "Image uploaded successfully");
        next();

    } catch (error) {
        console.error(error);
        next(error);
    }


}


module.exports = {
    upload,
    productImgUploadHandler
}