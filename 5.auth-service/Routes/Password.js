const express = require('express');
var Mailgun = require('mailgun-js');
var md5 = require('md5');
const validators = require('../tools/validation');
const jwt = require('jsonwebtoken');
const router = express.Router();

var mysql = require('mysql');
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

console.log(this.route)
/*
Post request from reset password page
*/
router.post('/ResetPasswordReq', function (req, res) {
    const email = req.body.email;
    const sql = `SELECT user_id FROM users WHERE user_email='${email}'`;
    let status = -1;
    connection.query(sql, function (err, result) {
        if (err || typeof result === 'undefined') res.status(500).json({ success: false, status: 3, message: 'Failed to connect DB' });
        else if (result.length === 0) {
            //The user not exist
            res.status(409).json({ status: 1, message: 'User not exists' })
        }
        //User exist
        else {
            var mailGun = new Mailgun({
                apiKey: process.env.MAILGUN_KEY,
                domain: process.env.MAILGUN_ADMIN
            });

            const token = jwt.sign({ userId: result[0].user_id, userEmail: email }, process.env.ACCESS_TOKEN_SECRET);
            const message = "We have received a request to reset your account password. please click the <a href=http://localhost:3000/resetPassword/" + token + "> link </a> to reset your password."

            const data = {
                from: 'eti.reznikov@workiz.com',
                to: email,
                subject: 'Reset Password',
                html: message
            }
            //send mail with link to reset password
            mailGun.messages().send(data, function (err, body) {
                //email sanding failed
                if (err) {
                    res.status(500).json({ status: 3, error: err, message: 'Failed sending mail' });
                }
                else {
                    //email sanding success
                    res.status(200).json({ status: 0, email: email });
                }
            });
        }
    });
});

/**chang password post request */
router.post('/NewPassword', function (req, res) {
    const data = {
        token: req.body.token,
        password: md5(req.body.password),
        confirm: md5(req.body.password),
    };

    //password validation
    if (!validators.passwordValidation(data.password, data.confirm)) {
        return res.status(403).json({ successStatus: 1,  message: 'Invalid password' })
    }
    else {
        //check the token
        jwt.verify(data.token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                return res.json({ successStatus: 2,  message: 'Failed to authenticate token.' });
            } else {
                const sql = `UPDATE users SET user_password='${data.password}' WHERE user_id='${decoded.userId}'`;
                connection.query(sql, function (err, result) {
                    if (err) res.status(505).json({ successStatus: 1,  message: 'Failed to update DB' })
                    else {
                        //* TODO: remove token form jwt/
                        return res.status(200).json({ successStatus: 0 })
                    }
                });
            }
        });
    }

});

module.exports = router;