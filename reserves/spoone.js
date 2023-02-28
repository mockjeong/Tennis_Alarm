require('chromedriver');
const { constants } = require('fs/promises');
const {Builder, By, Key, until, StaleElementReferenceError } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function spoCheckIn(targetMonth, targetDay){

  //Browser Open (Chrome) (--Headlsess Optional not working)
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments(
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--window-size=1920,1080",
      "--log-level=3"))
    .build();
  
  try {
    //Set Implicit Wait time for 5 seconds.
    await driver.manage().setTimeouts( { implicit: 5000 } );
    
    //TargetMonth, Day to string with 0 (use padStart)
    let targetMonthStr = targetMonth.toString().padStart(2, '0');
    let targetDayStr = targetDay.toString().padStart(2, '0');
  
    console.log('스포원 실내 : month :', targetMonthStr, 'day :', targetDayStr);

    var Courtlist = [];

    //Indoor Courtlist
    const courtUrl = { 21: '1', 22: '2', 23: '3',24: '4',25: '5',26: '6'}
    const indices = [21, 22, 23, 24, 25, 26];

    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      // Go to Reservation Site
      await driver.get(`https://nrsv.spo1.or.kr/rent/reservation/index/2023/${targetMonthStr}/${targetDayStr}/1/SPOONE/11/${index}`);

      await driver.wait(new Promise(resolve => setTimeout(resolve, 500)));
      // console.log(courtUrl[index]);
      let checkBoxes = await driver.findElements(By.css('input[type="checkbox"].select_check'));
      for (let i = 0; i < checkBoxes.length; i++) {
        let tr = await checkBoxes[i].findElement(By.xpath('ancestor::tr'));
        let tds = await tr.findElements(By.tagName('td'));
        let timeRange = await tds[2].getText();
        let time = timeRange.split(' ')[0].substring(0,2);
        console.log(`스포원 실내 ${time}시 ${courtUrl[index]}번`); // "06"
        Courtlist.push(`${time}시 ${courtUrl[index]}번`);
      }
    }

    console.log(`스포원 실내 조회 종료`);

    //Sourting the courtlist to ascending by Hour
    // convert times into time objects
    const timeObjects = Courtlist.map(Courtlist => {
      const [hour, minute] = Courtlist.split(' ')[0].split('시');
      const timeObject = new Date();
      timeObject.setHours(hour);
      timeObject.setMinutes(minute);
      return { time: Courtlist, timeObject: timeObject };
    });

    // sort timeObjects based on timeObject
    timeObjects.sort((a, b) => a.timeObject - b.timeObject);

    // display the sorted list
    // timeObjects.forEach(item => console.log(item.time));
    const sortedCourtList = timeObjects.map(item => item.time);

    return sortedCourtList;

  }
  finally {
    await driver.quit();
  }
}

async function spoCheckOut(targetMonth, targetDay){

  //Browser Open (Chrome) (--Headlsess Optional not working)
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments(
     "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--window-size=1920,1080",
      "--log-level=3"))
    .build();
  
  try {
    //Set Implicit Wait time for 5 seconds.
    await driver.manage().setTimeouts( { implicit: 5000 } );
    
    //TargetMonth, Day to string with 0 (use padStart)
    let targetMonthStr = targetMonth.toString().padStart(2, '0');
    let targetDayStr = targetDay.toString().padStart(2, '0');
  
    console.log('스포원 실외 : month :', targetMonthStr, 'day :', targetDayStr);

    var Courtlist = [];

    //Indoor Courtlist
    const courtUrl = { 7: '1', 8: '2', 12: '3',13: '4',14: '5',15: '6', 16: '7', 17: '8', 18: '9',19: '10',20: '11'}
    const indices = [7, 8, 12, 13, 14, 15, 16, 17, 18, 19, ];

    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      // Go to Reservation Site
      await driver.get(`https://nrsv.spo1.or.kr/rent/reservation/index/2023/${targetMonthStr}/${targetDayStr}/1/SPOONE/15/${index}`);

      await driver.wait(new Promise(resolve => setTimeout(resolve, 500)));
      // console.log(courtUrl[index]);
      let checkBoxes = await driver.findElements(By.css('input[type="checkbox"].select_check'));
      for (let i = 0; i < checkBoxes.length; i++) {
        let tr = await checkBoxes[i].findElement(By.xpath('ancestor::tr'));
        let tds = await tr.findElements(By.tagName('td'));
        let timeRange = await tds[2].getText();
        let time = timeRange.split(' ')[0].substring(0,2);
        console.log(`스포원 실외 ${time}시 ${courtUrl[index]}번`); // "06"
        Courtlist.push(`${time}시 ${courtUrl[index]}번`);
      }
    }

    console.log(`스포원 실외 조회 종료`);

    //Sourting the courtlist to ascending by Hour
    // convert times into time objects
    const timeObjects = Courtlist.map(Courtlist => {
      const [hour, minute] = Courtlist.split(' ')[0].split('시');
      const timeObject = new Date();
      timeObject.setHours(hour);
      timeObject.setMinutes(minute);
      return { time: Courtlist, timeObject: timeObject };
    });

    // sort timeObjects based on timeObject
    timeObjects.sort((a, b) => a.timeObject - b.timeObject);

    // display the sorted list
    // timeObjects.forEach(item => console.log(item.time));
    const sortedCourtList = timeObjects.map(item => item.time);

    return sortedCourtList;
    // return Courtlist;

    // while(1);

  }
  finally {
    await driver.quit();
  }
}
// spoCheckOut(3,3);

module.exports = {spoCheckIn, spoCheckOut};