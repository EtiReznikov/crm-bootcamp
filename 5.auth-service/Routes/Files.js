const express = require('express');
const router = express.Router();
var multer = require('multer');
var mysql = require('mysql');
const path = require('path');

// DB connection
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.connect(function (err) {
    //* TODO ask Yonatan
    if (err) throw (err);
});

// const DIR = '/public/uploads/';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

var upload = multer({ storage: storage })

router.post('/addImgToClient', upload.single('file'), (req, res) => {
    // if (multer.MulterError) {
    //     res.status(500).json({ status: 2, message: 'something wrong with saving the file' });
    // }
    // else {
        console.log(req.file)
        const pathNewFile = '/' + req.file.filename
        console.log(req.body.client_id)
        const clientId = req.body.client_id;
        const sql = `UPDATE clients SET file = '${pathNewFile}' WHERE client_id='${clientId}'`;
        console.log(sql)
        connection.query(sql, function (err, result) {
            if (err) res.status(500).json({ status: 2, message: 'Failed to update data' });
            else return res.status(200).json({ status: 1 })
        });
    // }
})



module.exports = router;