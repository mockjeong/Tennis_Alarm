const express = require('express')
const router = express.Router()
const {sajickCheck} = require('../reserves/sajick.js');
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

       // Create an array of promises for both sajickCheck function calls
      const promises = [sajickCheck(targetMonth, targetDay), sajickCheck(targetMonth, targetDay)];

      // Wait for both promises to resolve
      const [Courtlist, Courtlist2] = await Promise.all(promises);

      var template = handlebars.compile(fs.readFileSync('./views/index.handlebars', 'utf8'));
      var html = template({ error: '', result1: Courtlist, result2: Courtlist2 });
      res.send(html);
  }
})

module.exports = router;