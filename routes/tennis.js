const express = require('express')
const router = express.Router()
const {sjCheck} = require('../reserves/SJ_PP.js');
const {gdCheck} = require('../reserves/GD_P.js');
const {spoInCheck, spoOutCheck} = require('../reserves/SP_revised.js');
var fs = require('fs');
const handlebars = require('handlebars');
const moment = require('moment');

router.use('/', async (req, res) =>{
  
  //Information of body is called.
  var post = req.body;

  //
  const momentDate = moment(post.selectedDate, 'YYYY년 MM월 DD일');
  var targetMonth = momentDate.month() + 1;
  var targetDay =  momentDate.date();

  const promises =  [
                      post.court==='sajick' ? sjCheck(targetMonth, targetDay) : [],
                      post.court==='gooduck' ? gdCheck(targetMonth, targetDay) : [,,],
                      post.court==='spoIn' ? spoInCheck(targetMonth, targetDay) : [],
                      post.court==='spoOut' ? spoOutCheck(targetMonth, targetDay) : []
                    ];


  // Wait for all promises to either fulfill or reject
  const results = await Promise.allSettled(promises);

  // Separate the fulfilled results from the rejected results
  const fulfilledResults = results.filter(result => result.status === 'fulfilled');
  const rejectedResults = results.filter(result => result.status === 'rejected');

  // Check if there were any rejected promises
  if (rejectedResults.length > 0) {
    const errorMessages = rejectedResults.map(result => result.reason.message);
    console.log(errorMessages);
    //  req.flash('error', errorMessages.join('\n'));
    req.flash('error', '오류가 발생했습니다. 다시 조회 해주시기 바랍니다.');
    res.redirect('/');
    return;
  }

  // Get the values from the fulfilled promises
  const [sajickList, gooduckList, spoInList, spoOutList] = fulfilledResults.map(result => result.value);

  const display = ['none', 'none', 'none', 'none'];
  const courtIndex = ['sajick', 'gooduck', 'spoIn', 'spoOut'].indexOf(post.court);
  if (courtIndex >= 0) {
    display[courtIndex] = 'block';
  }

  var template = handlebars.compile(fs.readFileSync('./views/index.handlebars', 'utf8'));
  var html = template({ error: '', 
                        sajickResult: sajickList, 
                        gooduckResult: gooduckList, 
                        spInResult:spoInList,
                        spOutResult:spoOutList,
                        sjDisplay : display[0],
                        gdDisplay : display[1],
                        spInDisplay : display[2],   
                        spOutDisplay : display[3],   
                      });
  res.send(html);
})

module.exports = router;