import { resolve } from "path";
import minioClient from "../config/minio.config.js";




// Promisified MinIO helpers
const bucketExistsAsync = (name) => new Promise((resolve, reject) => {
    try {
        minioClient.bucketExists(name, (err, exists) => {
            if (err) return reject(err);
            resolve(!!exists);
        });
    } catch (e) {
        reject(e);
    }
});

const makeBucketAsync = (name) => new Promise((resolve, reject) => {
    minioClient.makeBucket(name, (err) => {
        if (err) return reject(err);
        resolve();
    });
});

const setBucketPolicyAsync = (name, policy) => new Promise((resolve, reject) => {
    minioClient.setBucketPolicy(name, policy, (err) => {
        if (err) return reject(err);
        resolve();
    });
});

const setupBucket = async (bucketName) => {
    try {
        const exists = await bucketExistsAsync(bucketName);
        if (!exists) {
            await makeBucketAsync(bucketName);
            console.log(`Bucket '${bucketName}' created successfully.`);
        }

        const publicReadPolicy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: ["s3:GetObject"],
                    Effect: "Allow",
                    Principal: "*",
                    Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
            ],
        };

        await setBucketPolicyAsync(bucketName, JSON.stringify(publicReadPolicy));
        console.log(`Bucket '${bucketName}' access policy set to Public Read.`);
    } catch (error) {
        console.error("Error configuring MinIO bucket:", error);
        throw error;
    }
};

/**
 * Uploads an object to MinIO.
 * * @param {Object} params
 * @param {string} params.bucket - The name of the bucket
 * @param {string} params.objectName - The file path/name inside the bucket
 * @param {Buffer} params.buffer - The file data
 * @param {number} params.size - The length of the buffer
 * @param {Object} params.meta - Metadata (e.g., {"Content-Type": "image/webp"})
 * @returns {Promise<string>} The etag of the uploaded object
 */
const putObjectAsync = (params) => new Promise((resolve, reject) => {
    minioClient.putObject(params.bucket, params.objectName, params.buffer, params.size, params.meta, (err, etag) => {
        if (err) return reject(err);
        resolve(etag);
    });
});

const deleteBucketAsync=async(bucketName)=> new Promise((resolve,reject)=>{
   
    minioClient.removeBucket(bucketName,(err)=>{
        if(err) return reject(err)
        resolve();
    })
  
})

const deleteObjectAsync=(bucketName,objectName)=> new Promise((resolve,reject)=>{
    console.log(`Attempting to delete object '${objectName}' from bucket '${bucketName}'`);
    minioClient.removeObject(bucketName,objectName,(err)=>{
        if(err) return reject(err)
        resolve();
    })
})


export {
    bucketExistsAsync,
    makeBucketAsync,
    setBucketPolicyAsync,
    putObjectAsync,
    setupBucket,
    deleteBucketAsync,
    deleteObjectAsync
};

// Sanitizer helper







