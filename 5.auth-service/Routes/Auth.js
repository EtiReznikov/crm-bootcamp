
const express = require('express');

var md5 = require('md5');
require('dotenv').config();
var cors = require('cors');
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

/*
Post request from signup page
*/

router.post('/CreateUser', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const businessName = req.body.businessName;
  const password = md5(req.body.password);
  const confirm = md5(req.body.confirm);
  let emailErrorStatus = true;

  let status = -3;
  const formValid = validators.nameValidation(name) && validators.phoneValidation(phone) && validators.emailValidation(email) && validators.passwordValidation(password, confirm) && businessName.length > 0;
  // form data invalid
  if (!formValid) {
    res.status(403).json({ status: -3, message: 'Something is wrong with form data' })
  }
  else {
    const sqlEmail = `SELECT user_id FROM users WHERE user_email='${email}'`;
    connection.query(sqlEmail, function (err, resultSelectEmail) {
      if (err || typeof resultSelectEmail === 'undefined') res.status(500).json({
         status: -3, message: 'Failed to connect DB'
      });
      //There is no user with such mail
      if (resultSelectEmail.length === 0) {
        // Insert business to DB
        const sqlBusiness = `INSERT INTO gym (gym_name) VALUES ('${businessName}')`;
        connection.query(sqlBusiness, function (err, businessResult) {
          if (err || typeof sqlBusiness === 'undefined') res.status(500).json({  status: -3, message: 'Failed to connect DB' });
          const businessId = businessResult.insertId;
          const permission_id = 0; //user is manager
          const sql = `INSERT INTO users (user_name, user_email, user_phone, user_password, gym_id,  permission_id ) VALUES ('${name}', '${email}', '${phone}' , '${password}' ,'${businessId}', '${permission_id}')`;
          connection.query(sql, function (err, result) {
            if (err || typeof result === 'undefined') throw res.status(500).json({  status: -3, message: 'Failed to connect DB' });
            emailErrorStatus = 0;
            const userId = result.insertId;
            const token = jwt.sign({ userId: userId, userEmail: email, businessId: businessId, name: name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });
            res.status(200).json({ token,  status: 0, formValid })
          });
        });
      }
      else {
        //user exists
        emailErrorStatus = 3;
        res.status(409).json({  status: 1, message: 'User exists' })
      }
    });
  }
});

/*
Post request from login page
*/

router.post('/Login', function (req, res) {
  const email = req.body.email;
  const password = md5(req.body.password);
  const sqlPassword = `SELECT user_id, user_password, user_name, gym_id FROM users WHERE user_email='${email}'`;
  let status = 3;
  connection.query(sqlPassword, function (err, resultSelectPassword) {
    if (err || typeof resultSelectPassword === 'undefined') res.status(500).json({ status: 3, message: 'Failed to connect DB' });
    else if (resultSelectPassword.length === 0) {
      //The user not exist
      status = 0;
      res.status(409).json({ status, message: 'User not exists' });
    }
    else {
      if (resultSelectPassword[0].user_password === password) {
        const token = jwt.sign({ userId: resultSelectPassword[0].user_id, userEmail: email, businessId: resultSelectPassword[0].gym_id, name: resultSelectPassword[0].user_name }, process.env.ACCESS_TOKEN_SECRET);
        status = 2; //log in
        res.status(200).json({ token, status, message: 'Logged in successfully' });
      }
      else {
        //password incorrect
        status = 0;
        res.status(409).json({ status, message: 'password incurrent' });
      }
    }
  });
});


/*
Post request from reset password page
*/
router.post('/ResetPasswordReq', function (req, res) {
  const email = req.body.email;
  const sql = `SELECT user_id FROM users WHERE user_email='${email}'`;
  let status = -1;
  connection.query(sql, function (err, result) {
    if (err) res.status(500).json({ success: false, message: 'Failed to connect DB' });
    if (result.length === 0) {
      //The user not exist
      status = 1;
     res.status(409).json({ status: 0, message: 'User not exists' })
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
          status = 2;
          res.status(500).json({ error: err, status: status });
        }
        else {
          //email sanding success
          status = 0;
          res.status(200).json({ email: email, status: status });
        }
      });
    }
  });
});
module.exports = router;