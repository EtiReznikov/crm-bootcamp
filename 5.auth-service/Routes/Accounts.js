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

/**add user to business post request */
router.post('/addUser', function (req, res) {
    const email = req.body.email;
    const token = req.body.token;
    const sql = `SELECT user_id FROM users WHERE user_email='${email}'`;
    let status = -1;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        else if (result.length > 0) {
            //The user exist
            res.status(409).json({ status: 1, message: 'user exists' });
        }
        else {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
                if (err) {
                    return res.status(500).json({ status: 2, message: 'Failed to authenticate token.' });
                } else {
                    var mailGun = new Mailgun({
                        apiKey: process.env.MAILGUN_KEY,
                        domain: process.env.MAILGUN_ADMIN
                    });
                    const token = jwt.sign({ userEmail: email, businessId: decoded.businessId, managerMail: decoded.userEmail }, process.env.ACCESS_TOKEN_SECRET);
                    const message = "You have invitation to join " + decoded.name + " team. <a href=http://localhost:3000/inviteUser/" + token + "> link </a> to continue the process."
                    const data = {
                        from: 'eti.reznikov@workiz.com',
                        to: email,
                        subject: 'Invitation',
                        html: message
                    }
                    mailGun.messages().send(data, function (err, body) {
                        if (err) {
                            res.status(500).json({ error: err, status: 2, message: 'Failed sending mail' });
                        }
                        else {
                            res.status(200).json({ email: email, status: 0 });
                        }
                    });
                }
            });
        }
    });
});


router.post('/CreateUserByInvite', function (req, res) {

    const name = req.body.name;
    const phone = req.body.phone;
    const password = md5(req.body.password);
    const confirm = md5(req.body.confirm);
    const token = req.body.token;

    const formValid = validators.nameValidation(name) && validators.phoneValidation(phone) && validators.passwordValidation(password, confirm);
    if (!formValid) {
        res.error(409).json({ successStatus: 2, message: 'Invalid Form' })
    }
    else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                return res.error(500).json({ successStatus: 2, message: 'Failed to authenticate token.' });
            } else {
                const permission_id = 1; //user is employee
                const sql = `INSERT INTO users (user_name, user_email, user_phone, user_password, gym_id, permission_id) VALUES ('${name}', '${decoded.userEmail}', '${phone}' , '${password}' ,'${decoded.businessId}', '${permission_id}')`;
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    const userId = result.insertId;
                    const token = jwt.sign({ userId: userId, userEmail: decoded.userEmail, businessId: decoded.businessId, name: name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });

                    var mailGun = new Mailgun({
                        apiKey: process.env.MAILGUN_KEY,
                        domain: process.env.MAILGUN_ADMIN
                    });

                    const message = name + " accept your invitation to join your team"

                    const data = {
                        from: 'eti.reznikov@workiz.com',
                        to: decoded.managerMail,
                        subject: 'invitation accepted',
                        html: message
                    }
                    //send mail to manager
                    mailGun.messages().send(data, function (err, body) {

                    });
                    res.json({ token, successStatus: 1 })
                });
            }
        });
    }
});

/** get Users list to users table */
router.post('/getUsersList', function (req, res) {
    const businessId = req.body.businessId;
    const sql = `SELECT user_name, user_phone,  permission_id, user_email, user_id FROM users WHERE gym_id= '${businessId}'`
    connection.query(sql, function (err, result) {
        if (err) res.status(500).json({
            status : 2,
            message: 'server error'
        });
        else {
            res.send(result);
        }
    });
});

//TODO: add remove user
module.exports = router;