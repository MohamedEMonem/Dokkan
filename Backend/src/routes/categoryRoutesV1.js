const express = require("express");
const router = express.Router();

const CategoryController = require("../controllers/CategoryController");
const { auth, authAdmin } = require("../middleware/auth");

router.get("/", CategoryController.getCategories);

router.use(auth);
router.use(authAdmin);

router.post("/", CategoryController.createCategory);
router.patch("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;