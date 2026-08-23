import multer from "multer";
import os from "os";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, os.tmpdir());
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname || "");
        const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;

        cb(null, uniqueName);
    },
});

export const upload = multer({
    storage,
});