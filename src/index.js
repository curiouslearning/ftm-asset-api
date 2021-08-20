const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();


app.get('/', function (req, res) {
    return res.send({greeting: 'Hello World!'})
});

app.get('/users', function (req, res) {

  return res.send(JSON.parse(fs.readFileSync('ExampleReturn.json')));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
