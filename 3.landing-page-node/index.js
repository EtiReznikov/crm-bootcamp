const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');

app.engine('html', mustacheExpress());

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
  const data = {
    a: 'hello world'
  };
  res.render('test', data);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});