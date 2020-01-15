const express = require('express');
const multer = require('multer');

const rootDir = "./";

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './datasets/summer2winter_yosemite/testA')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });

router.post('/', upload.array('files', 100), (req, res) => {
    const { files } = req;
    if (!files) { res.json({ "status": false }); }
    else { res.json({ "status": true }); }
});

module.exports = router;