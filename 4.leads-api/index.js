const fieldStatus = {
    name: true,
    phone: true,
    email: true
}
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'landingpage'
});

const express = require('express');
const app = express();
var cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.send('hello there');
});
app.post('/', function(req, res) {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const gender = req.body.gender;
    const moreInfo = req.body.moreInfo;
    const updatesConfirm = req.body.updatesConfirm
    let flag;
    console.log(updatesConfirm)
    nameValidation(name)
    phoneValidation(phone);
    emailValidation(email);
    if (fieldStatus.name && fieldStatus.phone && fieldStatus.email) {
        flag = true;
    } else {
        flag = false;
    }

    const data = {
        name: name,
        flag: flag
    }
    if (data.flag) {
        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = `INSERT INTO leads (name, phone_number,email) VALUES ('${name}', '${phone}', '${email}')`;

            connection.query(sql, function(err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        });
    }
    res.send(data);




});
app.listen(process.env.PORT, () => {
    console.log(`
                    Server running at http: //localhost:${process.env.PORT}/`);
});



/**
 * 
 * @param {*} name
 * check that the name is valid.
 */

function nameValidation(name) {
    const isValidName = /^[a-zA-Z\s]*$/.test(name);
    if (name.length < 2) {
        fieldStatus.name = false;
    } else if (isValidName) {
        fieldStatus.name = true;
    } else {
        fieldStatus.name = false;
    }
}

/**
 * 
 * @param {*} phoneNumber 
 * check that the phoneNumber is valid.
 */
function phoneValidation(phoneNumber) {
    const isOnlyDigit = /^\d+$/.test(phoneNumber);
    if (phoneNumber.length != 7) {
        fieldStatus.phone = false;
    } else if (isOnlyDigit) {
        fieldStatus.phone = true;
    } else {
        fieldStatus.phone = false;
    }
}

/**
 * @param {*} email
 * check that the email is valid.
 */

function emailValidation(email) {
    const validEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
    if (validEmail) {
        fieldStatus.email = true;
    } else if (email.length == 0) {
        fieldStatus.email = false;
    } else if (!validEmail) {
        fieldStatus.email = false;
    }
}