const jwt = require('jsonwebtoken');
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
  if (err) throw(err);
});


function LoginDB(email,password){
    console.log(email)
    const sqlPassword = `SELECT user_id, user_password, user_name, gym_id FROM users WHERE user_email='${email}'`;
    let status = -1;
    connection.query(sqlPassword, function (err, resultSelectPassword) {
    
      if (err) return { success: -1, message: 'server error' };
      else if (resultSelectPassword.length === 0) {
        //The user not exist
        status = 0;
        
        return { status, message: 'User not exists' }
      }
      else {
        if (resultSelectPassword[0].user_password === password) {
          const token = jwt.sign({ userId: resultSelectPassword[0].user_id, userEmail: email, businessId: resultSelectPassword[0].gym_id, name: resultSelectPassword[0].user_name }, process.env.ACCESS_TOKEN_SECRET);
          status = 2; //log in
          return { token, status , message: 'Logged in successfully' };
        }
        else {
          //password incorrect
          status = 0;
          send ({ status, message: 'password incurrent' });
        }
      }
    });
    return { success: -1, message: 'server error' };
}

module.exports = {LoginDB}