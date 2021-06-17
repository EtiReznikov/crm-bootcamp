const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');

app.engine('html', mustacheExpress());

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static('views'));

app.get('/admin', function(req, res) {
    const data = {
        "title": "Lea Edri - Personal Trainer",
        "name": req.query.name,
    };
    res.render('leads', data);
});


app.get('/', function(req, res) {
    const data = {
        "title": "Lea Edri - Personal Trainer",
        "area-codes": [
            { "area-code": "050" },
            { "area-code": "052" },
            { "area-code": "053" },
            { "area-code": "054" },
            { "area-code": "055" },
            { "area-code": "056" },
            { "area-code": "058" },
            { "area-code": "059" }
        ],
        "genders": [{
                "gender": "male"
            },
            { "gender": "female" }
        ],

        "slogan1": "Don't wish for results -",
        "slogan2": "work for it!",
        "updates-slogan": "Get updates and special offers - promise not to spam you!",
        "Name": "Name",
        "phone-number": "Phone Number",
        "email": "Email Address",
        "more-info": "Something that you want us to know",
        "btn-txt": "Submit"
    };

    res.render('index_.html', data);
});

app.get('/submitted', function(req, res) {
    const data = {
        "title": "Lea Edri - Personal Trainer",
        "name": req.query.name,
    };

    res.render('ThankYou', data);
});


app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}/`);
});