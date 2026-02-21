require('dotenv').config();
const express = require('express');
const app = express();
const { sendSuccess } = require('./utils/response');
const uploadRoutes = require('./routes/upload.js');
const productRoutes = require('./routes/productRoutes.js');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
    return sendSuccess(res, { 
        status: 'OK', 
        timestamp: new Date().toISOString() 
    }, 'Server is healthy');
});
app.use("/products", productRoutes);

app.use('/uploads',uploadRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Error handling middleware for Multer
const { sendError } = require('./utils/response');


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});