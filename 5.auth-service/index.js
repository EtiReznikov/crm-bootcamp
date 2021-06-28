const express = require('express');
const app = express();
var cors = require('cors')
app.use(express.json());
app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const validators = require('./tools/validation');
const jwt = require('jsonwebtoken');

var mysql = require('mysql');
var md5 = require('md5');

const accessTokenSecret = 'tokensecret1234';


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crm'
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});


app.use( function (req, res, next) {
  const reqPath= req.path;
  console.log(req.headers.authentication)
 
  //Login or Logout request- JWT not required
  if (req.path === '/Login' || req.path === '/CreateUser'){
    next();
  }
  //If JWT token was sent
  else if (req.headers.authentication !=='null') {
    console.log("Token")
    jwt.verify(req.headers.authentication, accessTokenSecret, function (err, decoded) {
      if (err) {
        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded; 
        const sql= `SELECT user_id FROM users WHERE user_id='${decoded.userId}' AND user_email='${decoded.userEmail}'`
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
  console.log("home")
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
  // if (!formValid){
  //   res.json({ formValid })
  // }
//  else{
    
  connection.query(sqlEmail, function (err, resultSelectEmail) {
    if (err) throw err;
    if (resultSelectEmail.length === 0) {
      const sql = `INSERT INTO users (user_name, user_email, user_phone, user_password) VALUES ('${name}', '${email}', '${phone}' , '${password}')`;
      connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        emailErrorStatus = 0;
        const user_id = result.insertId;
        const token = jwt.sign({ userId: user_id, userEmail: email }, accessTokenSecret, { expiresIn: 86400 });
        res.json({ token, emailErrorStatus })
        // TODO: remove token from DB
        const sqlToken = `UPDATE users SET token='${token}' WHERE user_id='${user_id}'`
        connection.query(sqlToken, function (err, result) {
          if (err) throw err;
          console.log("1 record updated");
        });

        // console.log(data.emailStatus)
        // });
      });
    }
    else {
      console.log("email exists")
      emailErrorStatus = 3;
      res.json({ emailErrorStatus })
    }
  });
//}
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

        const token = jwt.sign({ userId: resultSelectPassword[0].user_id , userEmail: email }, accessTokenSecret);
        console.log("log in");
        status = 2; //log in
        res.json({ token, status })
        // TODO: remove token from DB
        // const sqlToken = `UPDATE users SET token='${token}' WHERE user_id='${user_id}'`
        // connection.query(sqlToken, function (err, result) {
        //   if (err) throw err;
        //   console.log("1 record updated");
        // });

      }
      else {
        console.log("password incorrect")
        status = 1; //password incorrect
        res.json({ status });
      }

    }
  });

  // res.send("login");

});

// app.post('/AuthApi', function(req, res) {
//   const token= req.body.token;

//   jwt.verify(token, accessTokenSecret, function(err, decoded) {
//     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//     console.log(decoded);
//     res.status(200).send(decoded);

// });

// });
app.get('/', function (req, res) {
  res.send('hello there');
});



app.listen(process.env.PORT, () => {
  console.log(`Server running at http: //localhost:${process.env.PORT}/`);
});
