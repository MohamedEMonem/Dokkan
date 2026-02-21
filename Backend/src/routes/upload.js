const express = require('express');
const router = express.Router();
const {upload,productImgUploadHandler} = require('../controllers/uploadController');




router.post('/api/product/single', upload.single('product'), productImgUploadHandler);
router.post('/api/product/multiple', upload.array('product', 5), productImgUploadHandler);


module.exports = router;