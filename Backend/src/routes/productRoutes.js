import express from "express";
const router = express.Router();
// const {upload,productImgUploadHandler} = require('../controllers/uploadController');
import { upload } from "../middleware/uploadValidator.js";

import * as ProductController from "../controllers/ProductController.js";
import { auth, authStoreOwner } from "../middleware/auth.js";

router.get("/", ProductController.getProducts);

// router.use(auth);
// router.use(authStoreOwner);

// router.post("/", upload.single("product"),productImgUploadHandler,ProductController.createProduct);
router.post("/",auth,upload.single("image"),ProductController.createProduct);
router.patch("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export default router;