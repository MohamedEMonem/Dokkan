import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file || !file.mimetype || !file.mimetype.startsWith('image/')) {
            return cb(new Error("Only image files are allowed"));
        }
        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) {
            return cb(new Error("Only JPEG, PNG, GIF, and WebP files are allowed"));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});


