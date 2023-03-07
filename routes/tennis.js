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
  // console.log(post);
  const momentDate = moment(post.selectedDate, 'YYYY년 MM월 DD일');
  var targetMonth = momentDate.month() + 1;
  var targetDay =  momentDate.date();

  const promises =  [
                      post.court==='sajick' ? sjCheck(targetMonth, targetDay) : [],
                      post.court==='gooduck' ? gdCheck(targetMonth, targetDay) : [,,],
                      post.court==='spoone' ? spoCheck(targetMonth, targetDay) : [,]
                    ];


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
  const [sajickList, gooduckList, spooneList] = fulfilledResults.map(result => result.value);

  let block = ['none', 'none', 'none'];

  switch (post.court){
    case 'sajick':
      block[0] = 'block';
      break;
    case 'gooduck':
      block[1] = 'block';
      break;
    case 'spoone':
      block[2] = 'block';
      break;
    default:
      break;
  }

  var template = handlebars.compile(fs.readFileSync('./views/index.handlebars', 'utf8'));
  var html = template({ error: '', 
                        sajickResult: sajickList, 
                        gooduckResult1: gooduckList[0], 
                        gooduckResult2: gooduckList[1], 
                        gooduckResult3: gooduckList[2],
                        sponeResult1:spooneList[0],
                        sponeResult2:spooneList[1],
                        sjDisplay : block[0],
                        gdDisplay : block[1],
                        spDisplay : block[2],   
                      });
  res.send(html);
})

module.exports = router;