const {deleteBucketAsync, setupBucket}=require('./utils/minioClient')




const createBucket=async()=>{
    try {
        await setupBucket(process.argv[3])
        console.log("Bucket setup successfully.")
    } catch (error) {
        console.error("Error setting up bucket:", error);
    }
}


const runDelete=async()=>{ 
    try {
        await deleteBucketAsync(process.argv[3])
        console.log("Bucket deleted successfully.")
    } catch (error) {
        console.error("Error deleting bucket:", error);
    }
}
if (process.argv[2]==="create") createBucket();
else if(process.argv[2]==="delete") runDelete()
