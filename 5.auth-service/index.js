const express = require('express');
const app = express();
var cors = require('cors')
const bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const jwt = require('jsonwebtoken');

var mysql = require('mysql');
var md5= require('md5');

const accessTokenSecret = 'tokensecret1234';


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crm'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});





app.post('/CreateUser', function(req, res) {
  
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = md5(req.body.password);

   emailErrorStatus=true;
 
  const sqlEmail= `SELECT user_id FROM users WHERE user_email='${email}'`;
  
  connection.query(sqlEmail, function(err, resultSelectEmail) {
    if (err) throw err;
    if (resultSelectEmail.length===0){
      const sql = `INSERT INTO users (user_name, user_email, user_phone, user_password) VALUES ('${name}', '${email}', '${phone}' , '${password}')`;
      connection.query(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        emailErrorStatus=false;
        const token= jwt.sign({ userId: result.insertId}, accessTokenSecret );
        res.json({token})

        // console.log(data.emailStatus)
    // });
    });
  }
    else{
      console.log("email exists")
      emailErrorStatus=true;

    }
  });
  // const data={
  //   emailErrorStatus: emailErrorStatus,
  // };
  // console.log(emailErrorStatus);
  // res.send(data);

});


app.post('/Login', function(req, res) {
  
  const email = req.body.email;
  const password = md5(req.body.password);
 
  const sqlPassword= `SELECT user_id, user_password FROM users WHERE user_email='${email}'`;
  let status;
  connection.query(sqlPassword, function(err, resultSelectPassword) {
    if (err) throw err;
    if (resultSelectPassword.length===0){
      console.log("user not exist")
      //The user not exist
      status=0;
      res.json(status);
  }
    else{

       if (resultSelectPassword[0].user_password === password){

        const token= jwt.sign({ userId: resultSelectPassword[0].user_id}, accessTokenSecret );
        console.log("log in");
        status=2; //log in
        res.json({token, status})
       
       }
       
        else{
          console.log("password incorrect")
          status=1; //password incorrect
          res.json(status);
        }
      
    }
  });

  // res.send("login");

});


app.get('/', function(req, res) {
  res.send('hello there');
});


app.listen(process.env.PORT, () => {
  console.log(`Server running at http: //localhost:${process.env.PORT}/`);
});
