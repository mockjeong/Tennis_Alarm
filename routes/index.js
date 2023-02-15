const express = require('express')
const router = express.Router()

router.get('/', function(request, response){
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
    </html>
  `
  response.send(html);
});

module.exports = router;