const express = require('express')
const router = express.Router()
// const {sajickCheck} = require('../reserves/sajick.js');
const {sjCheck} = require('../reserves/SJ_PP.js');
const {gdCheck} = require('../reserves/GD_P.js');
const {spoCheck} = require('../reserves/SP_PP.js');
var fs = require('fs');
const handlebars = require('handlebars');

//Import for Timecal
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

router.use('/', async (req, res) =>{
  const { month, day } = req.body;

  //TargetMonth, Day to string with 0 (use padStart)
  let inputDayStr = day.toString().padStart(2, '0');

  const today = dayjs().tz("Asia/Seoul").startOf('day'); // Get the start of today in the client's timezone
  const inputDate = dayjs(`${month}-${inputDayStr}`).startOf('day'); // Get the start of the target date

  const isWithin7Days = inputDate.isSameOrAfter(today) && inputDate.isSameOrBefore(today.add(6, 'day'));
  // console.log(isWithin7Days);

  // Check if the input month and day are within 7 days of today's date
  // const inputDate = new Date(`${month}-${day}`);
  // const today = new Date();
  // const oneWeekLater = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
  
  if (!(isWithin7Days)) {
    // Show an error message to the user
    req.flash('error', '오늘부터 7일 이내로 설정해주세요.');
    res.redirect('/');
    return;
  }
  else{
      var post = req.body;
      var targetMonth = parseInt(post.month.split('-')[1]);
      var targetDay = post.day;

      const promises = [sjCheck(targetMonth, targetDay),
        gdCheck(targetMonth, targetDay),
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
  }
})

module.exports = router;