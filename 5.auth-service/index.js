
const express = require('express');
var mysql = require('mysql');
var md5 = require('md5');
require('dotenv').config();
var cors = require('cors');
var Mailgun = require('mailgun-js');
const validators = require('./tools/validation');
const jwt = require('jsonwebtoken');
const app = express();

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


const Auth= require('./Routes/Auth');
app.use('/Auth', Auth);

/*
Middleware to verify that jwt is valid
*/

app.use(function (req, res, next) {
  const authentication = req.body.headers ? req.body.headers.authentication : undefined;
  const reqPath = req.path;
  //Paths where JWT not required 
  if (req.path === '/Login' || req.path === '/CreateUser' || req.path === '/ResetPasswordReq' || req.path === '/NewPassword'  || req.path === '/CreateUserByInvite' || req.path === '/SignUp' || req.path === '/LoginSignup') {
    next(); 
  }

  //If JWT token was sent
  else if (authentication!== undefined) {
    jwt.verify(authentication, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        // The token doesn't exist in JWT
        return res.status(403).json({ success: false, message: 'token invalid' });
      } else {
        req.decoded = decoded;
        const sql = `SELECT user_id FROM users WHERE user_id='${decoded.userId}' AND user_email='${decoded.userEmail}'`
        connection.query(sql, function (err, result) {
          //mysql serer error
          if (err) res.status(500).json({ success: false,
            message: 'server error'
          });
          else if (result.length === 0) {
            //token data mot valid
            return res.status(403).send({
              //* TODO: remove token form jwt/
              success: false,
              message: 'token invalid'
            });
          }
          //success
          else next();
        });
      }
    });
  }
  else {
    // if JWT token wasn't sent
    return res.status(403).send({
      success: false,
      message: 'token invalid'
    });
  }
});

app.post('/home', function (req, res) {
  res.send('home');
});


/*
Post request from reset password page
*/
app.post('/ResetPasswordReq', function (req, res) {
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


/**chang password post request */
app.post('/NewPassword', function (req, res) {
  const data = {
    token: req.body.token,
    password: md5(req.body.password),
    confirm: md5(req.body.password),
  };

  //password validation
  if (!validators.passwordValidation(data.password, data.confirm)) {
    return res.status(403).json({ successStatus: 1 })
  }

  //check the token
  jwt.verify(data.token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.json({ successStatus: 2, message: 'Failed to authenticate token.' });
    } else {
      const sql = `UPDATE users SET user_password='${data.password}' WHERE user_id='${decoded.userId}'`;
      connection.query(sql, function (err, result) {
        if (err) res.status(505).json({ ssuccessStatus: 1, message: 'Failed to update DB' })
        else {
          //* TODO: remove token form jwt/
          return res.status(200).json({ successStatus: 0 })
        }
      });
    }
  });

});

/**add user to business post request */
app.post('/addUser', function (req, res) {
  const email = req.body.email;
  const token = req.body.token;
  const sql = `SELECT user_id FROM users WHERE user_email='${email}'`;
  let status = -1;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length > 0) {
      //The user not exist
      status = 1;
      res.status(409).json({ status:status, message: 'user exists' });
    }
    else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
          return res.status(500).json({ successStatus: 2, message: 'Failed to authenticate token.' });
        } else {
          var mailGun = new Mailgun({
            apiKey: process.env.MAILGUN_KEY,
            domain: process.env.MAILGUN_ADMIN
          });
          const token = jwt.sign({ userEmail: email, businessId: decoded.businessId , managerMail: decoded.userEmail}, process.env.ACCESS_TOKEN_SECRET);
          const message = "You have invitation to join " + decoded.name + " team. <a href=http://localhost:3000/inviteUser/" + token + "> link </a> to continue the process."

          const data = {
            from: 'eti.reznikov@workiz.com',
            to: email,
            subject: 'Invitation',
            html: message
          }
          mailGun.messages().send(data, function (err, body) {
            if (err) {
              status = 2;
              res.status(500).json({ error: err, status: status });
            }
            else {
              status = 0;
              res.status(200).json({ email: email, status: status });
            }
          });
        }
      });
    }
  });
});

//** User accept invitation post request */

app.post('/CreateUserByInvite', function (req, res) {

  const name = req.body.name;
  const phone = req.body.phone;
  const password = md5(req.body.password);
  const confirm = md5(req.body.confirm);
  const token = req.body.token;

  const formValid = validators.nameValidation(name) && validators.phoneValidation(phone) && validators.passwordValidation(password, confirm);
  if (!formValid) {
    res.json({  successStatus: 2 })
  }
  else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.json({ successStatus: 2, message: 'Failed to authenticate token.' });
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
app.post('/getUsersList', function (req, res) {
  let data = [];
  const sql = `SELECT user_name, user_phone,  permission_id, user_email FROM users;`
  connection.query(sql, function (err, result) {
    if (err) res.status(500).json({ success: false,
      message: 'server error'
    });
    else {
       for (row in result){
        result[row].permission_id  = result[row].permission_id==0 ? 'Manager' : 'Employee'
       }
      res.send(result);
    }
});
});

app.get('/', function (req, res) {
  res.send('hello there');
});


app.listen(process.env.PORT, () => {
  console.log(`Server running at http: //localhost:${process.env.PORT}/`);
});
