const express = require("express");
const router = express.Router();
const { 
  auth,
  authAdmin, 
} = require("../middleware/auth");
const { sendSuccess } = require("../utils/response");

const {
 register,
} = require("../controllers/authController");

// Public routes (no authentication required)
router.post("/register", register);

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
