
const express = require('express');
let Mailgun = require('mailgun-js');
let md5 = require('md5');
require('dotenv').config();
const validators = require('../tools/validation');
const jwt = require('jsonwebtoken');
const router = express.Router();

let mysql = require('mysql');
// DB connection
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) console.log(err)
});

/*
Post request from signup page
*/

const emailMySql = (sqlEmail) => {
  return new Promise((res, rej) => {
    connection.query(sqlEmail, (err, resultSelectEmail) => {
      if (err || typeof resultSelectEmail === 'undefined') return rej({
        status: 500,
        json: { status: -3, message: 'Failed to connect DB' }
      });
      if (resultSelectEmail.length > 0) {
        return rej({ status: 409, json: { status: 1, emailErrorStatus: 3, message: 'User exists' } });
      }
      else {
        res(resultSelectEmail)
      }
    });
  });
}

const gymMySql = (sqlBusiness) => {
  return new Promise((res, rej) => {
    connection.query(sqlBusiness, (err, businessResult) => {
      if (err || typeof businessResult === 'undefined') return rej(

        { status: 500, json: { status: -3, message: 'Failed to connect DB' } }

      );
      else {
        res(businessResult);
      }
    });
  });
}

const userMySql = (sql) => {
  return new Promise((res, rej) => {
    connection.query(sql, function (err, insertResult) {
      if (err || typeof insertResult === 'undefined') return rej({
        status: 500,
        json: { status: -3, message: 'Failed to connect DB' }
      });
      res(insertResult);
    });
  });
}
router.post('/CreateUser', async (req, result) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const businessName = req.body.businessName;
  const password = md5(req.body.password);
  const confirm = md5(req.body.confirm);
  let emailErrorStatus = -1;

  let status = -3;

  let response = {}
  const formValid = validators.nameValidation(name) && validators.phoneValidation(phone) && validators.emailValidation(email) && validators.passwordValidation(password, confirm) && businessName.length > 0;
  // form data invalid
  if (!formValid) {
    result.status(403).json({ status: -3, message: 'Something is wrong with form data' })
  }
  else {
    try {
      const sqlEmail = `SELECT user_id FROM users WHERE user_email='${email}'`;
      const emailUniqPromise = await emailMySql(sqlEmail)
      const sqlBusiness = `INSERT INTO gym (gym_name) VALUES ('${businessName}')`;
      const CreateGymPromise = await gymMySql(sqlBusiness)
      const businessId = CreateGymPromise.insertId;
      const permission_id = 0;
      const sql = `INSERT INTO users (user_name, user_email, user_phone, user_password, gym_id,  permission_id ) VALUES ('${name}', '${email}', '${phone}' , '${password}' ,'${businessId}', '${permission_id}')`;
      const CreateUserPromise = await userMySql(sql);
      const userId = CreateUserPromise.insertId;
      const token = jwt.sign({ userId: userId, userEmail: email, businessId: businessId, name: name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });
      response = { status: 200, json: { token, status: 0, formValid, businessId, name } }
    }
    catch (err) {
      result.status(err.status);
      result.send(err.json);
    }
    result.status(response.status);
    result.send(response.json);
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
        const businessId = resultSelectPassword[0].gym_id;
        const name = resultSelectPassword[0].user_name;
        const token = jwt.sign({ userId: resultSelectPassword[0].user_id, userEmail: email, businessId: resultSelectPassword[0].gym_id, name: resultSelectPassword[0].user_name }, process.env.ACCESS_TOKEN_SECRET);
        status = 2; //log in
        res.status(200).json({ token, status, message: 'Logged in successfully', businessId, name });
      }
      else {
        //password incorrect
        status = 0;
        res.status(409).json({ status, message: 'password incurrent' });
      }
    }
  });
});



module.exports = router;