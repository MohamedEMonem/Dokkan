const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER || "root",
  secretKey: process.env.MINIO_ROOT_PASSWORD || "rootpassword",
});

module.exports = minioClient;
