const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { date } = require("joi");
const { register } = require("node:module");

const JWT_SECRET = process.env.JWT_SECRET;

function saltingString(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        const shifted = charCode << i % 8;
        sum += shifted;
    }
    return sum;
}

// GET /users - Admin only


const createUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const saltedPassword = saltingString(password);
        const hashedPassword = await bcrypt.hash(saltedPassword.toString(), 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error in createUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    register: createUser
};
