const express = require('express');
const router = express.Router();
let multer = require('multer');
let mysql = require('mysql');
const path = require('path');

// DB connection
let connection = mysql.createConnection({
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

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single('file');

router.post('/addImgToClient', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ status: 3, err })
        } else if (err) {
            return res.status(500).json({ status: 2, err })
        }
        // return res.status(200).send(req.file)
        else {
            const pathNewFile = '/' + req.file.filename
            const clientId = req.body.client_id;
            const sql = `UPDATE clients SET file = '${pathNewFile}' WHERE client_id='${clientId}'`;
            connection.query(sql, function (err, result) {
                if (err) res.status(500).json({ status: 2, message: 'Failed to update data' });
                else return res.status(200).json({ status: 1 })
            });
        }
    })

});



module.exports = router;