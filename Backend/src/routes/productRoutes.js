const express = require("express");
const router = express.Router();
// const {upload,productImgUploadHandler} = require('../controllers/uploadController');
const {upload}=require("../middleware/uploadValidator");

const ProductController = require("../controllers/ProductController");
const { auth, authStoreOwner } = require("../middleware/auth");
const { imgUploadHandler } = require("../utils/minioClient");

router.get("/", ProductController.getProducts);

// router.use(auth);
// router.use(authStoreOwner);

// router.post("/", upload.single("product"),productImgUploadHandler,ProductController.createProduct);
router.post("/",auth,authStoreOwner,upload.single("image"),ProductController.createProduct);
router.patch("/:id", auth, authStoreOwner, upload.single("image"), ProductController.updateProduct);
router.delete("/:id", auth, authStoreOwner, ProductController.deleteProduct);
module.exports = router;
