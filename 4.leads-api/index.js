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

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

const express = require('express');
const app = express();
var cors = require('cors')

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.post('/leads', function(req, res) {
    console.log(req.body);

    let flag;
    let data = {
        leads: {}
    };
    const orderBy = req.body.orderBy ? req.body.orderBy : ''
    console.log("order by", orderBy);
    const sql = `SELECT * FROM leads ${orderBy}`;
    console.log(sql);
    connection.query(sql, function(err, result, fields) {
        res.send(result);

    });

});


app.get('/', function(req, res) {
    res.send('hello there');
});
app.post('/', function(req, res) {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const gender = req.body.gender;
    let moreInfo = req.body.moreInfo;
    const updatesConfirm = req.body.updatesConfirm
    let flag;
    nameValidation(name)
    phoneValidation(phone);
    emailValidation(email);
    moreInfo = moreInfoValidation(moreInfo);
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
        const genderBin = gender == '' ? '' : gender == 'male' ? 'm' : 'f';
        const sql = `INSERT INTO leads (name, phone_number,email, gender, more_info, update_confirm) VALUES ('${name}', '${phone}', '${email}', '${gender}', '${moreInfo}', '${updatesConfirm }')`;
        connection.query(sql, function(err, result) {
            if (err) throw err;
            console.log("1 record inserted");

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
/**
 * @param {*} moreInfo
 * check that the email is valid.
 */
function moreInfoValidation(moreInfo) {
    return escape(moreInfo)
}