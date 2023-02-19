const express = require('express')
const router = express.Router()

router.get('/', function(req, res){
  var html = 
  ` <!doctype html>
    <html>
    <head>
      <title>AKZD</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">AKZD Tennis Alarm Service</a></h1>
    </body>
    <div><a href ="/">사직 테니스장</a></h1>
    <div>
      <label for="month">Month:</label>
      <input type="month" id="month" name="month" value="2023-02">
      <label for="day">Day:</label>
      <input type="text" id="day" name="day" pattern="[0-9]{1,2}" placeholder="DD">
    </div>
    <form action="/tennischeck" method="get">
      <input type="submit" value="Submit">
    </form>

    </html>
  `
  res.send(html);
});

module.exports = router;