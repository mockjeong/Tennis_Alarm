const express = require('express');
const router = express.Router();
var fs = require('fs');
const handlebars = require('handlebars');

router.get('/', function(req, res){
  var fmsg = req.flash();
  var error = '';
  if(fmsg.error){
    error = fmsg.error;
  }
  var template = handlebars.compile(fs.readFileSync('./views/index.handlebars', 'utf8'));
  var html = template({ error: error, result1: '결과 없음' });
  res.send(html);
});

module.exports = router;