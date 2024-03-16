const multer = require("multer");
const crypto = require("crypto");

const internalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    const uniqueSuffix = `${crypto.randomUUID()}`;
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `${file.originalname}-${uniqueSuffix}.${fileExtension}`);
  },
});

const uploads = multer({ storage: internalStorage });

module.exports = uploads;
