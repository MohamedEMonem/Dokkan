const { bucketExistsAsync,
    makeBucketAsync,
    setBucketPolicyAsync,
    putObjectAsync,
    setupBucket,
        deleteObjectAsync
} = require("../utils/minioClient")
const minioClient = require("../../minio.config.js");

const crypto = require('crypto');
const sharp = require('sharp');

const publicBucketName = "dokkan-public-assets"


const sanitizer =(name, maxLen = 63) => {
    if (!name) return '';
    let s = String(name).toLowerCase();
    s = s.replace(/[^a-z0-9-]/g, '-');
    s = s.replace(/-+/g, '-'); 
    s = s.replace(/^-|-$/g, '');
    if (s.length > maxLen) s = s.slice(0, maxLen);
    return s;
};



const optimizedImageBuffer =async(buffer)=> {
    try {
        
            const optimizedBuffer = await sharp(buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .webp({ quality: 80 })
            .toBuffer();
        return optimizedBuffer;

    } catch (error) {
        throw error;
    }

        }

const determinePathName=({clientRole,subFolder,clientEmail,fileName})=>{
        const uniqeId= crypto.randomBytes(8).toString('hex');
        


    return `${clientRole}/${subFolder}/${sanitizer(clientEmail.split("@")[0])}/${sanitizer(fileName)}-${uniqeId}.webp`;

}

const uploadPublicImg = async (file, clientEmail, clientRole, subFolder) => {
    try {
        if (!(file && clientEmail && clientRole)) throw new Error("Missing required parameters");

        const fileName = file.originalname;
        console.log("Received file for upload:", { fileName, clientEmail, clientRole, subFolder });
        const objectName = determinePathName({ clientRole, subFolder, clientEmail, fileName: fileName });

        const buffer = await optimizedImageBuffer(file.buffer);

        await putObjectAsync({ bucket: publicBucketName, objectName, buffer, size: buffer.length, meta: { "Content-Type": "image/webp" } });

        const imgUrl = `${process.env.MINIO_PUBLIC_URL}/${publicBucketName}/${objectName}`;
        return imgUrl;
    }
    catch (err) {
        throw err;
    }

}

const deletePublicImg = async (imgUrl) => {
    // take the object path after the bucket name
    if (!imgUrl) return;
    const marker = `${publicBucketName}/`;
    const idx = imgUrl.indexOf(marker);
    if (idx === -1) {
        console.warn("deletePublicImg: URL does not contain bucket name", imgUrl);
        return;
    }
    const objectName = imgUrl.substring(idx + marker.length);
    await deleteObjectAsync(publicBucketName, objectName);
}

module.exports = {
    uploadPublicImg,
    deletePublicImg
};