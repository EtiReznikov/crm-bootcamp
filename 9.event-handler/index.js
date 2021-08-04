


const express = require('express');
require('dotenv').config();
let cors = require('cors');
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes')
app.use('/api/v1', routes)


app.listen(3030, () => {
    console.log(`Server running at http: //localhost:${3030}/`);
});


