import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const allowedExtensions = /\.(jpe?g|png|webp|gif)$/i;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (req, file, cb) => {
    const hasValidExtension = allowedExtensions.test(path.extname(file.originalname));
    const hasValidMimeType = allowedMimeTypes.includes(file.mimetype);

    if (hasValidExtension && hasValidMimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (jpg, jpeg, png, webp, gif) are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

export default upload;