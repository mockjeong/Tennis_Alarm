const express = require('express')
const router = express.Router()
const {sajick, sajickCheck} = require('../reserves/selenium.js');

router.get('/', async (req, res) =>{
  const Courtlist = await sajickCheck(02,19);
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
    <div><a href ="/tennischeck">사직테니스장 조회 시작</a></h1>
    <div>${Courtlist}</div>
    </html>
  `
  res.send(html);
})

module.exports = router;