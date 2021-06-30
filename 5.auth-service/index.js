
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

/*
Middleware to verify that jwt is valid
*/

app.use(function (req, res, next) {
  const reqPath = req.path;
  //Paths where JWT not required
  if (req.path === '/Login' || req.path === '/CreateUser' || req.path === '/ResetPasswordReq' || req.path === '/NewPassword' || req.path === '/addUser' || req.path === '/CreateUserByInvite') {
    next();
  }
  //If JWT token was sent
  else if (req.headers.authentication !== 'null') {
    jwt.verify(req.headers.authentication, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        // The token doesn't exist in JWT
        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        const sql = `SELECT user_id FROM users WHERE user_id='${decoded.userId}' AND user_email='${decoded.userEmail}'`
        connection.query(sql, function (err, result) {
          //mysql serer error
          if (err) res.status(500).json({ success: false, message: 'Failed to connect DB' });
          else if (result.length === 0) {
            //token data mot valid
            return res.status(403).send({
              //* TODO: remove token form jwt/
              success: false,
              message: 'The token is not valid'
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
      message: 'No token provided.'
    });
  }
});

app.post('/home', function (req, res) {
  res.send('home');
});

/*
Post request from signup page
*/
app.post('/CreateUser', function (req, res) {

  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const businessName = req.body.businessName;
  const password = md5(req.body.password);
  const confirm = md5(req.body.confirm);
  let emailErrorStatus = true;

  const formValid = validators.nameValidation(name) && validators.phoneValidation(phone) && validators.emailValidation(email) && validators.passwordValidation(password, confirm) && businessName.length > 0;
  // form data invalid
  if (!formValid) {
    res.status(403).json({ formValid: formValid, message: 'Something is wrong with form data' })
  }
  else {
    const sqlEmail = `SELECT user_id FROM users WHERE user_email='${email}'`;
    connection.query(sqlEmail, function (err, resultSelectEmail) {
      if (err) res.status(500).json({ success: false, message: 'Failed to connect DB' });
      //There is no user with such mail
      if (resultSelectEmail.length === 0) {
        // Insert business to DB
        const sqlBusiness = `INSERT INTO gym (gym_name) VALUES ('${businessName}')`;
        connection.query(sqlBusiness, function (err, businessResult) {
          if (err) res.status(500).json({ success: false, message: 'Failed to connect DB' });
          const businessId = businessResult.insertId;
          const permission_id = 0; //user is manager
          const sql = `INSERT INTO users (user_name, user_email, user_phone, user_password, gym_id,  permission_id ) VALUES ('${name}', '${email}', '${phone}' , '${password}' ,'${businessId}', '${permission_id})`;
          connection.query(sql, function (err, result) {
            if (err) throw res.status(500).json({ success: false, message: 'Failed to connect DB' });
            emailErrorStatus = 0;
            const userId = result.insertId;
            const token = jwt.sign({ userId: userId, userEmail: email, businessId: businessId, name: name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });
            res.status(200).json({ token, emailErrorStatus, formValid })
          });
        });
      }
      else {
        // TODO ask Yonatan which status should be here
        //user exists
        emailErrorStatus = 3;
        res.json({ emailErrorStatus: emailErrorStatus })
      }
    });
  }
});

/*
Post request from login page
*/
app.post('/Login', function (req, res) {
  const email = req.body.email;
  const password = md5(req.body.password);
  const sqlPassword = `SELECT user_id, user_password FROM users WHERE user_email='${email}'`;
  let status = -1;
  connection.query(sqlPassword, function (err, resultSelectPassword) {
    if (err) res.status(500).json({ success: false, message: 'Failed to connect DB' });
    if (resultSelectPassword.length === 0) {
      //The user not exist
      status = 0;
      // TODO ask Yonatan which status should be here
      res.json({ status });
    }
    else {
      if (resultSelectPassword[0].user_password === password) {
        const token = jwt.sign({ userId: resultSelectPassword[0].user_id, userEmail: email }, process.env.ACCESS_TOKEN_SECRET);
        status = 2; //log in
        res.status(200).json({ token, status })
      }
      else {
        //password incorrect
        status = 0;
        // TODO ask Yonatan which status should be here
        res.json({ status });
      }
    }
  });
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
      // TODO ask Yonatan which status should be here
      res.json({ status });
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
    return res.json({ successStatus: 1 })
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
          return res.json({ successStatus: 0 })
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
      res.json({ status });
    }
    else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
          return res.json({ successStatus: 2, message: 'Failed to authenticate token.' });
        } else {
          var mailGun = new Mailgun({
            apiKey: process.env.MAILGUN_KEY,
            domain: process.env.MAILGUN_ADMIN
          });

          const token = jwt.sign({ userEmail: email, businessId: decoded.businessId }, process.env.ACCESS_TOKEN_SECRET);
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
              res.json({ error: err, status: status });
            }
            //Else we can greet    and leave
            else {
              status = 0;

              res.json({ email: email, status: status });
            }
          });
        }
      });
    }
  });
});

app.post('/CreateUserByInvite', function (req, res) {

  const name = req.body.name;
  const phone = req.body.phone;
  const password = md5(req.body.password);
  const confirm = md5(req.body.confirm);
  const token = req.body.token;

  const formValid = validators.nameValidation(name) && validators.phoneValidation(phone) && validators.passwordValidation(password, confirm);
  // formStatus = formValid;
  if (!formValid) {
    res.json({ formValid })
  }
  else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.json({ successStatus: 2, message: 'Failed to authenticate token.' });
      } else {
        const sql = `INSERT INTO users (user_name, user_email, user_phone, user_password, gym_id, permmision_id) VALUES ('${name}', '${decoded.userEmail}', '${phone}' , '${password}' ,'${decoded.businessId}', 1)`;
        connection.query(sql, function (err, result) {
          if (err) throw err;
          const userId = result.insertId;
          const token = jwt.sign({ userId: userId, userEmail: decoded.userEmail, businessId: decoded.businessId, name: name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });
          res.json({ token, formValid })
        });
      }
    });
  }
});

app.get('/', function (req, res) {
  res.send('hello there');
});


app.listen(process.env.PORT, () => {
  console.log(`Server running at http: //localhost:${process.env.PORT}/`);
});
