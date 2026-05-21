import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ROOT_USER || "root",
  secretKey: process.env.MINIO_ROOT_PASSWORD || "rootpassword",
});

minioClient
  .bucketExists("dokkan")
  .then((exists) => {
    if (!exists) {
      return minioClient.makeBucket("dokkan");
    }
  })
  .then(() => console.log("MinIO bucket 'dokkan' is ready"))
  .catch((err) => {
    console.error("Error setting up MinIO bucket:", err);
    process.exit(1);
  });

export default minioClient;
