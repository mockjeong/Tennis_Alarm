const express = require('express')
const router = express.Router()
const {sjCheck} = require('../reserves/SJ_PP.js');
const {gdCheck} = require('../reserves/GD_P.js');
const {spoCheck} = require('../reserves/SP_PP.js');
var fs = require('fs');
const handlebars = require('handlebars');
const moment = require('moment');

router.use('/', async (req, res) =>{

  var post = req.body;
  const momentDate = moment(post.selectedDate, 'YYYY년 MM월 DD일');
  var targetMonth = momentDate.month() + 1;
  var targetDay =  momentDate.date();

  const today = moment().utcOffset(9);
  const currentMonth = today.month() + 1;
  const currentDay = today.date();

  const promises = [sjCheck(targetMonth, targetDay),
    currentMonth === targetMonth && currentDay === targetDay ? [,,] : gdCheck(targetMonth, targetDay),
    spoCheck(targetMonth, targetDay)
  ];//spoCheckOut(targetMonth, targetDay)];

  // Wait for all promises to either fulfill or reject
  const results = await Promise.allSettled(promises);

  // Separate the fulfilled results from the rejected results
  const fulfilledResults = results.filter(result => result.status === 'fulfilled');
  const rejectedResults = results.filter(result => result.status === 'rejected');

  // Check if there were any rejected promises
  if (rejectedResults.length > 0) {
    const errorMessages = rejectedResults.map(result => result.reason.message);
    //  req.flash('error', errorMessages.join('\n'));
    req.flash('error', '오류가 발생했습니다. 다시 조회 해주시기 바랍니다.');
    res.redirect('/');
    return;
  }

  // Get the values from the fulfilled promises
  const [sajickList, gooduckList1, spooneList1] = fulfilledResults.map(result => result.value);

  var template = handlebars.compile(fs.readFileSync('./views/index.handlebars', 'utf8'));
  var html = template({ error: '', 
                        sajickResult: sajickList, 
                        gooduckResult1: gooduckList1[0], 
                        gooduckResult2: gooduckList1[1], 
                        gooduckResult3: gooduckList1[2],
                        sponeResult1:spooneList1[0],
                        sponeResult2:spooneList1[1]});
  res.send(html);
})

module.exports = router;