require('dotenv').config();
const express = require('express');
const app = express();
var cors = require('cors')
var Mailgun = require('mailgun-js')
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const validators = require('./tools/validation');
const jwt = require('jsonwebtoken');

var mysql = require('mysql');
var md5 = require('md5');


var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // host: 'localhost',
  // user: 'root',
  // password: '',
  // database: 'crm'
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
/*
Middleware to verify that jwt is valid
*/

app.use(function (req, res, next) {
  const reqPath = req.path;

  //Login or Logout request- JWT not required
  if (req.path === '/Login' || req.path === '/CreateUser' || req.path === '/ResetPasswordReq' || req.path === '/NewPassword') {
    next();
  }
  //If JWT token was sent
  else if (req.headers.authentication !== 'null') {
    jwt.verify(req.headers.authentication, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        const sql = `SELECT user_id FROM users WHERE user_id='${decoded.userId}' AND user_email='${decoded.userEmail}'`
        connection.query(sql, function (err, result) {
          if (err) throw err;
          else if (result.length === 0) {
            return res.status(403).send({
              success: false,
              message: 'The token is not valid'
            });
          }
          else next();
        });
      }
    });
  }
  else {
    // if there is no token
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.post('/home', function (req, res) {
  res.send('home');
});

app.post('/CreateUser', function (req, res) {

  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = md5(req.body.password);
  const confirm = md5(req.body.confirm);
  emailErrorStatus = true;

  const sqlEmail = `SELECT user_id FROM users WHERE user_email='${email}'`;
  const formValid = validators.nameValidation(name) && validators.phoneValidation(phone) && validators.emailValidation(email) && validators.passwordValidation(password, confirm);
  // formStatus = formValid;
  if (!formValid) {
    res.json({ formValid })
  }
  else {

    connection.query(sqlEmail, function (err, resultSelectEmail) {
      if (err) throw err;
      if (resultSelectEmail.length === 0) {
        const sql = `INSERT INTO users (user_name, user_email, user_phone, user_password) VALUES ('${name}', '${email}', '${phone}' , '${password}')`;
        connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
          emailErrorStatus = 0;
          const user_id = result.insertId;
          const token = jwt.sign({ userId: user_id, userEmail: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });
          res.json({ token, emailErrorStatus, formValid })

        });
      }
      else {
        console.log("email exists")
        emailErrorStatus = 3;
        res.json({ emailErrorStatus })
      }
    });
  }
});


app.post('/Login', function (req, res) {

  const email = req.body.email;
  const password = md5(req.body.password);
  const sqlPassword = `SELECT user_id, user_password FROM users WHERE user_email='${email}'`;
  let status = -1;
  connection.query(sqlPassword, function (err, resultSelectPassword) {
    if (err) throw err;
    if (resultSelectPassword.length === 0) {
      console.log("user not exist")
      //The user not exist
      status = 0;
      res.json({ status });

    }

    else {

      if (resultSelectPassword[0].user_password === password) {

        const token = jwt.sign({ userId: resultSelectPassword[0].user_id, userEmail: email }, process.env.ACCESS_TOKEN_SECRET);
        console.log("log in");
        status = 2; //log in
        res.json({ token, status })

      }
      else {
        console.log("password incorrect")
        status = 1; //password incorrect
        res.json({ status });
      }

    }
  });


});

app.post('/ResetPasswordReq', function (req, res) {
  const email = req.body.email;
  const sql = `SELECT user_id FROM users WHERE user_email='${email}'`;
  let status = -1;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length === 0) {
      console.log("user not exist")
      //The user not exist
      status = 1;
      res.json({ status });
    }
    else {
      var mailGun = new Mailgun({
        apiKey: process.env.MAILGUN_KEY,
        domain: process.env.MAILGUN_ADMIN
      });

      const token = jwt.sign({ userId: result[0].user_id, userEmail: email }, process.env.ACCESS_TOKEN_SECRET);
     const message= "We have received a request to reset your account password. please click the <a href=http://localhost:3000/resetPassword/"+token+"> link </a> to reset your password."
      
     const data = {
        from: 'eti.reznikov@workiz.com',
        to: email,
        subject: 'Reset Password',
        html: message
      }

      mailGun.messages().send(data, function (err, body) {
        if (err) {
          status = 2;
          res.json({ error: err, status: status });
          console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
          //Here "submitted.jade" is the view file for this landing page 
          //We pass the variable "email" from the url parameter in an object rendered by Jade
          status = 0;
          res.json({ email: email, status: status });
        }
      });
    }
  });
});
/**chang password post request */
app.post('/NewPassword', function (req, res) {
  console.log("new pass")
  const data = {
    token : 1234,
    password : md5(req.body.password),
    confirm : md5(req.body.password),
  };
 
  //password validation
  if (!validators.passwordValidation(data.password, data.confirm)){
    return res.json({successStatus : 1 })
  }

  //check the token
  jwt.verify(data.token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    console.log(decoded)
    if (err) {
      return res.json({ successStatus: 2 , message: 'Failed to authenticate token.' });
    }else{
      const sql = `UPDATE users SET user_password='${data.password}' WHERE user_id='${decoded.userId}'`;
      console.log(sql);
        connection.query(sql, function (err, result) {
          if (err) res.status(505).json({success: 1, message: 'Failed to update DB'})
          else{
            //* TODO: remove token form jwt/
            return res.json({successStatus : 0 })
          }
        });
    }
  });

});

app.get('/', function (req, res) {
  res.send('hello there');
});




app.listen(process.env.PORT, () => {
  console.log(`Server running at http: //localhost:${process.env.PORT}/`);
});
