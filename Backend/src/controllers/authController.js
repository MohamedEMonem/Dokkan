const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendSuccess, sendError, sendServerError } = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET;

function getJwtSecret() {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    return JWT_SECRET;
}

const createUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const normalizedName = typeof name === "string" ? name.trim() : "";

        // Validation
        if (!email || !password || !normalizedName) {
            return sendError(res, "Please provide email, password, and name", 400);
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return sendError(res, "User already exists", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: normalizedName,
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
            getJwtSecret(),
            { expiresIn: "7d" }
        );

        const safeUser = { ...user, name: user.name?.trimEnd() };

        return sendSuccess(
            res,
            { user: safeUser, token },
            "User created successfully",
            201
        );
    } catch (error) {
        return sendServerError(res, "Internal server error", error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendError(res, "Please provide email and password", 400);
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return sendError(res, "Invalid email or password", 401);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendError(res, "Invalid email or password", 401);
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            getJwtSecret(),
            { expiresIn: "7d" }
        );
        return sendSuccess(
            res,
            { user: { id: user.id, email: user.email, name: user.name?.trimEnd(), role: user.role }, token },
            "Logged in successfully"
        );
    } catch (error) {
        return sendServerError(res, "Internal server error", error);
    }
};

module.exports = {
    register: createUser,
    login: login
};
