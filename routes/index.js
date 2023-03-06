const express = require('express');
const router = express.Router();
var fs = require('fs');
const handlebars = require('handlebars');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

router.get('/', function(req, res){
  var fmsg = req.flash();
  var error = '';
  if(fmsg.error){
    error = fmsg.error;
  }
  var template = handlebars.compile(fs.readFileSync('./views/index.handlebars', 'utf8'));
  var html = template({ error: error});

  // var today = dayjs().tz("Asia/Seoul").format('YYYY-MM-DD');
  // var target = dayjs('2023-03-15');
  // var bool = target.isSameOrAfter(today,'week');

  const today = dayjs().tz("Asia/Seoul").startOf('day'); // Get the start of today in the client's timezone
  const target = dayjs('2023-03-12').startOf('day'); // Get the start of the target date

  const isWithin7Days = target.isSameOrAfter(today) && target.isSameOrBefore(today.add(7, 'day'));
  console.log(isWithin7Days);

  res.send(html);
});

module.exports = router;