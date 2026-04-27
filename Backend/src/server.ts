import dotenv from "dotenv";
import express from "express";
import { sendSuccess, sendError } from "./utils/response.js";
import { productRoutes } from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import storeRouter from "./routes/storeRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
// @ts-ignore
import cors from "cors";

dotenv.config();
const app = express();
// const uploadRoutes = require('./routes/upload.js');

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//npm install corsconfigured for development, in production we will use nginx to handle cors
app.use(cors({
    origin: "http://localhost:5000",
    credentials: true,
    optionsSuccessStatus: 200
}));

app.get('/api/health', (req, res) => {
    return sendSuccess(res, { 
        status: 'OK', 
        timestamp: new Date().toISOString() 
    }, 'Server is healthy');
});
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stores", storeRouter);

// app.use('/uploads',uploadRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
// Error handling middleware for Multer

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});