const express = require("express");
const router = express.Router();
const { 
  auth,
  authAdmin, 
} = require("../middleware/auth");
const { sendSuccess } = require("../utils/response");

const {
 register,
 login
} = require("../controllers/authController");
const { log } = require("node:console");

// Public routes (no authentication required)
router.post("/register", register);

// public routes (no authentication required)
router.post("/login", login);

// Protected routes (authentication required)
router.get("/profile", auth, (req, res) => {
    return sendSuccess(
        res,
        { user: req.user },
        "Authenticated successfully"
    );
});
// router.put("/profile", auth, updateProfile);



module.exports = router;
