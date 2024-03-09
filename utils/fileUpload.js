const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    // {Object} req - The request object.
    // {Object} file - The file object.
    // {Function} cb - The callback function.
    // Sets the destination for a file upload.
    destination: (req, file, cb) => {
        cb(null, 'content');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));//while storing we will modify the file name, to avoid any name conflicts. 
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10000000,
    },
    /**
     * This function is used as a file filter for a specific request.
     * It checks if the file type is allowed based on the defined file types.
     */
    fileFilter: (req, file, cb) => {
        // Define the allowed file types using a regular expression
        const fileTypes = /jpg|png|mp4|gif|jpeg/;
        const mimeType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname));

        // console.log(file.mimetype, mimeType, extName);
        if (mimeType && extName) {
            return cb(null, true);
        }
        cb("Only images/videos allowed");
    }
}).single("content");

module.exports = upload;




