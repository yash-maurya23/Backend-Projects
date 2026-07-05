import fs from 'fs'
import path from 'path'
import multer from 'multer'

const tempDir = path.resolve(process.cwd(), 'public', 'temp')

if (fs.existsSync(tempDir) && !fs.statSync(tempDir).isDirectory()) {
    fs.unlinkSync(tempDir)
}

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir)
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname || '')
        const uniqueName = `${file.fieldname}-${Date.now()}${ext}`
        cb(null, uniqueName)
    }
})

export const upload = multer({
    storage,
})