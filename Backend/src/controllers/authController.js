const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendSuccess, sendError, sendServerError } = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET || "admin";

function saltingString(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        const shifted = charCode << i % 8;
        sum += shifted;
    }
    return sum;
}

const createUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Validation
        if (!email || !password || !name) {
            return sendError(res, "Please provide email, password, and name", 400);
        }
        
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return sendError(res, "User already exists", 400);
        }
        
        const saltedPassword = saltingString(password);
        const hashedPassword = await bcrypt.hash(saltedPassword.toString(), 10);
        
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        return sendSuccess(
            res,
            { user, token },
            "User created successfully",
            201
        );
    } catch (error) {
        return sendServerError(res, "Internal server error", error);
    }
};

module.exports = {
    register: createUser
};
