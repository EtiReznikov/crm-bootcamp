
const express = require('express');
var mysql = require('mysql');
var md5 = require('md5');
require('dotenv').config();
var cors = require('cors');
var Mailgun = require('mailgun-js');
const validators = require('./tools/validation');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.static('public'));  
app.use('/uploads', express.static('uploads')); 

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));



// DB connection
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  //* TODO ask Yonatan
  if (err) throw(err);
});




/*
Middleware to verify that jwt is valid
*/

app.use(function (req, res, next) {
  const authentication = req.body.headers ? req.body.headers.authentication : undefined;

  //Paths where JWT not required 
  if ( req.path === '/Auth/CreateUser' || req.path === 'Password/ResetPasswordReq' || req.path === '/Password/NewPassword'  || req.path === '/Accounts/CreateUserByInvite' || req.path === '/Auth/Login' || req.path === '/Files/addImgToClient' || req.path === '/Accounts/getUsersList' ) {
    next(); 
  }

  //If JWT token was sent
  else if (authentication!== undefined) {
    jwt.verify(authentication, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        // The token doesn't exist in JWT
        return res.status(403).json({ status: 10, success: false, message: 'token invalid' });
      } else {
        req.decoded = decoded;
        const sql = `SELECT user_id FROM users WHERE user_id='${decoded.userId}' AND user_email='${decoded.userEmail}'`
        connection.query(sql, function (err, result) {
          //mysql serer error
          if (err) res.status(500).json({ status: 10, success: false,
            message: 'server error'
          });
          else if (result.length === 0) {
            //token data mot valid
            return res.status(403).send({
              //* TODO: remove token form jwt/
              status: 10,
              success: false,
              message: 'token invalid'
            });
          }
          //success
          else {
            next();

          }
        });
      }
    });
  }
  else {
    // if JWT token wasn't sent
    return res.status(403).send({
      success: false,
      message: "token wasn't sent"
    });
  }
});


const Auth = require('./Routes/Auth');
app.use('/Auth', Auth);

const Password = require('./Routes/Password');
app.use('/Password', Password);

const Accounts = require('./Routes/Accounts');
app.use('/Accounts', Accounts);

const Files = require('./Routes/Files');
app.use('/Files', Files)


app.post('/home', function (req, res) {
  res.send('home');
});


app.get('/', function (req, res) {
  res.send('hello there');
});


app.listen(process.env.PORT, () => {
  console.log(`Server running at http: //localhost:${process.env.PORT}/`);
});
