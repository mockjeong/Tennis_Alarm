const express = require('express')
const router = express.Router()
const {sajickCheck} = require('../reserves/sajick.js');
const {GooduckCheck} = require('../reserves/Gooduck.js');
const {spoCheckIn, spoCheckOut} = require('../reserves/spoone.js');
var fs = require('fs');
const handlebars = require('handlebars');

router.use('/', async (req, res) =>{
  const { month, day } = req.body;

  // Check if the input month and day are within 7 days of today's date
  const inputDate = new Date(`${month}-${day}`);
  const today = new Date();
  const oneWeekLater = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
  
  if (inputDate < today || inputDate > oneWeekLater) {
    // Show an error message to the user
    req.flash('error', '오늘부터 7일 이내로 설정해주세요.');
    res.redirect('/');
    return;
  }
  else{
      var post = req.body;
      var targetMonth = parseInt(post.month.split('-')[1]);
      var targetDay = post.day;
      var gooduck_url1 = 'https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=289#';
      var gooduck_url2 = 'https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=290#';
      var gooduck_url3 = 'https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=291#';

       // Create an array of promises for both sajickCheck function calls
      const promises = [sajickCheck(targetMonth, targetDay),
                        GooduckCheck(targetMonth, targetDay, gooduck_url1),
                        GooduckCheck(targetMonth, targetDay, gooduck_url2),
                        GooduckCheck(targetMonth, targetDay, gooduck_url3),
                        spoCheckIn(targetMonth, targetDay),
                        spoCheckOut(targetMonth, targetDay)];

      // // Wait for both promises to resolve
      // const [sajickList, gooduckList1, gooduckList2, gooduckList3] = await Promise.all(promises);

      // Wait for all promises to either fulfill or reject
      const results = await Promise.allSettled(promises);

      // Separate the fulfilled results from the rejected results
      const fulfilledResults = results.filter(result => result.status === 'fulfilled');
      const rejectedResults = results.filter(result => result.status === 'rejected');

      // Check if there were any rejected promises
      if (rejectedResults.length > 0) {
        const errorMessages = rejectedResults.map(result => result.reason.message);
        // req.flash('error', errorMessages.join('\n'));
        req.flash('error', '오류가 발생했습니다. 다시 조회 해주시기 바랍니다.');
        res.redirect('/');
        return;
      }

      // Get the values from the fulfilled promises
      const [sajickList, gooduckList1, gooduckList2, gooduckList3, spooneList1, spooneList2] = fulfilledResults.map(result => result.value);

      var template = handlebars.compile(fs.readFileSync('./views/index.handlebars', 'utf8'));
      var html = template({ error: '', 
                            sajickResult: sajickList, 
                            gooduckResult1: gooduckList1, 
                            gooduckResult2: gooduckList2, 
                            gooduckResult3: gooduckList3,
                            sponeResult1:spooneList1,
                            sponeResult2:spooneList2});
      res.send(html);
  }
})

module.exports = router;