import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError, sendServerError } from "../utils/response.js";

function getJwtSecret() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwtSecret;
}

// Reusable select for public user fields (never expose password)
const USER_PUBLIC_SELECT = {
    id: true,
    email: true,
    name: true,
    role: true,
    contactNumber: true,
    profilePhotoUrl: true,
    isVerified: true,
    createdAt: true
};

// Trim trailing spaces caused by Char(50) DB column
function trimUser(user) {
    if (!user) return user;
    return { ...user, name: user.name?.trimEnd() };
}

// ───────────────────────────── Register ─────────────────────────────

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body.data ;
        const normalizedName = typeof name === "string" ? name.trim() : "";

        // Validation
        if (!email || !password || !normalizedName) {
            return sendError(res, "Please provide email, password, and name", 400);
        }

        if (normalizedName.length > 50) {
            return sendError(res, "Name must be at most 50 characters", 400);
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
            select: USER_PUBLIC_SELECT
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            getJwtSecret(),
            { expiresIn: "7d" }
        );

        return sendSuccess(
            res,
            { user: trimUser(user), token },
            "User created successfully",
            201
        );
    } catch (error) {
        return sendServerError(res, "Internal server error", error);
    }
};

// ───────────────────────────── Login ─────────────────────────────

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

        // Block soft-deleted users from logging in
        if (user.deletedAt) {
            return sendError(res, "Account has been deleted", 401);
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
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name?.trimEnd(),
                    role: user.role,
                    contactNumber: user.contactNumber,
                    profilePhotoUrl: user.profilePhotoUrl,
                    isVerified: user.isVerified
                },
                token
            },
            "Logged in successfully"
        );
    } catch (error) {
        return sendServerError(res, "Internal server error", error);
    }
};

// ───────────────────────────── Get Profile ─────────────────────────────

const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: USER_PUBLIC_SELECT
        });

        if (!user) {
            return sendError(res, "User not found", 404);
        }

        return sendSuccess(
            res,
            { user: trimUser(user) },
            "Profile retrieved successfully"
        );
    } catch (error) {
        return sendServerError(res, "Internal server error", error);
    }
};

// ───────────────────────────── Patch Profile ─────────────────────────────

const patchProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const allowedFields = ["name", "contactNumber", "profilePhotoUrl"];
        const payloadKeys = Object.keys(req.body || {});

        if (payloadKeys.length === 0) {
            return sendError(res, "No data provided for update", 400);
        }

        const invalidFields = payloadKeys.filter((key) => !allowedFields.includes(key));
        if (invalidFields.length > 0) {
            return sendError(res, `Invalid fields: ${invalidFields.join(", ")}`, 400);
        }

        const data = {};

        // name — required, Char(50)
        if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
            const value = req.body.name;
            if (value === null) {
                return sendError(res, "name cannot be null", 400);
            }
            if (typeof value !== "string" || value.trim().length === 0) {
                return sendError(res, "name must be a non-empty string", 400);
            }
            if (value.trim().length > 50) {
                return sendError(res, "name must be at most 50 characters", 400);
            }
            data.name = value.trim();
        }

        // contactNumber — nullable, VarChar(20)
        if (Object.prototype.hasOwnProperty.call(req.body, "contactNumber")) {
            const value = req.body.contactNumber;
            if (value === null) {
                data.contactNumber = null;
            } else if (typeof value === "string") {
                const trimmed = value.trim();
                if (trimmed.length > 20) {
                    return sendError(res, "contactNumber must be at most 20 characters", 400);
                }
                data.contactNumber = trimmed.length ? trimmed : null;
            } else {
                return sendError(res, "contactNumber must be a string or null", 400);
            }
        }

        // profilePhotoUrl — nullable, VarChar(255)
        if (Object.prototype.hasOwnProperty.call(req.body, "profilePhotoUrl")) {
            const value = req.body.profilePhotoUrl;
            if (value === null) {
                data.profilePhotoUrl = null;
            } else if (typeof value === "string") {
                const trimmed = value.trim();
                if (trimmed.length > 255) {
                    return sendError(res, "profilePhotoUrl must be at most 255 characters", 400);
                }
                data.profilePhotoUrl = trimmed.length ? trimmed : null;
            } else {
                return sendError(res, "profilePhotoUrl must be a string or null", 400);
            }
        }

        if (Object.keys(data).length === 0) {
            return sendError(res, "No valid fields provided for update", 400);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
            select: USER_PUBLIC_SELECT
        });

        return sendSuccess(
            res,
            { user: trimUser(updatedUser) },
            "Profile updated successfully"
        );
    } catch (error) {
        return sendServerError(res, "Internal server error", error);
    }
};

// ───────────────────────────── Delete Account (soft) ─────────────────────────────

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.deletedAt) {
            return sendError(res, "Account not found or already deleted", 404);
        }

        await prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date() }
        });

        return sendSuccess(res, null, "Account deleted successfully");
    } catch (error) {
        return sendServerError(res, "Internal server error", error);
    }
};

export {
    register,
    login,
    getProfile,
    patchProfile,
    deleteAccount
};
