import dotenv from "dotenv";
import express from "express";
import { sendSuccess, sendError } from "./utils/response.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
// const uploadRoutes = require('./routes/upload.js');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
    return sendSuccess(res, { 
        status: 'OK', 
        timestamp: new Date().toISOString() 
    }, 'Server is healthy');
});
app.use("/api/products", productRoutes);

// app.use('/uploads',uploadRoutes);

app.use("/api/auth", authRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use("/api/cart", cartRoutes);

// Error handling middleware for Multer

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});