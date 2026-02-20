const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const { auth, authStoreOwner } = require("../middleware/auth");

router.get("/", ProductController.getProducts);

router.use(auth);
router.use(authStoreOwner);

router.post("/", ProductController.createProduct);
router.patch("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;