const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.send('hello there');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});