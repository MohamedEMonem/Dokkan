require('dotenv').config();
const express = require('express');
const app = express();
const { sendSuccess } = require('./utils/response');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
    return sendSuccess(res, { 
        status: 'OK', 
        timestamp: new Date().toISOString() 
    }, 'Server is healthy');
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});