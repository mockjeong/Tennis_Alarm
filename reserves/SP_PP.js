const puppeteer = require('puppeteer');

async function spoCheck(targetMonth, targetDay) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    //TargetMonth, Day to string with 0 (use padStart)
    let targetMonthStr = targetMonth.toString().padStart(2, '0');
    let targetDayStr = targetDay.toString().padStart(2, '0');

    var courtListIn = [];
    const courtMapIn = { 21: '1', 22: '2', 23: '3', 24: '4', 25: '5', 26: '6' };
    const indicesIn = [21, 22, 23, 24, 25, 26];

    console.log(`스포원 실내 조회 중...`)

    for (let i = 0; i < indicesIn.length; i++) {
      const index = indicesIn[i];

      await Promise.all([
        page.waitForNavigation({ timeout: 10000 }),
        page.goto(`https://nrsv.spo1.or.kr/rent/reservation/index/2023/${targetMonthStr}/${targetDayStr}/1/SPOONE/11/${index}`),
      ]);

      try{
        let checkboxes = await page.$$('input[type="checkbox"].select_check');
        if (checkboxes.length === 0) {
          // console.log(`실내 ${courtMapIn[index]}번 예약 불가`);
        } else {
          for (const checkbox of checkboxes) {
            const tr = await checkbox.$('xpath=ancestor::tr');
            const tds = await tr.$$('td');
            const timeRange = await tds[2].evaluate((td) => td.innerText);
            const time = timeRange.split(' ')[0].substring(0, 2);
            // console.log(`스포원 실내 ${time}시 ${courtMapIn[index]}번`);
            courtListIn.push(`${time}시 ${courtMapIn[index]}번`);
          }
        }
      } catch (e) {
        console.error('Error waiting for elements:', e);
      }
    }

    console.log(`스포원 실내 조회 종료`)
    
    courtListIn.sort((a, b) => {
      const [aHour, aMinute] = a.split(' ')[0].split('시');
      const [bHour, bMinute] = b.split(' ')[0].split('시');
      return aHour - bHour || aMinute - bMinute;
    });

    var courtListOut = [];

    //Indoor Courtlist
    const courtMapOut = { 7: '1', 8: '2', 12: '3',13: '4',14: '5',15: '6', 16: '7', 17: '8', 18: '9',19: '10',20: '11'}
    const indicesOut = [7, 8, 12, 13, 14, 15, 16, 17, 18, 19, ];

    console.log(`스포원 실외 조회 중...`)

    for (let i = 0; i < indicesOut.length; i++) {
      const index = indicesOut[i];

      await Promise.all([
        page.waitForNavigation({ timeout: 10000 }),
        page.goto(`https://nrsv.spo1.or.kr/rent/reservation/index/2023/${targetMonthStr}/${targetDayStr}/1/SPOONE/15/${index}`),
      ]);

      try{
        let checkboxes = await page.$$('input[type="checkbox"].select_check');
        if (checkboxes.length === 0) {
          // console.log(`실외 ${courtMapOut[index]}번 예약 불가`);
        } else {
          for (const checkbox of checkboxes) {
            const tr = await checkbox.$('xpath=ancestor::tr');
            const tds = await tr.$$('td');
            const timeRange = await tds[2].evaluate((td) => td.innerText);
            const time = timeRange.split(' ')[0].substring(0, 2);
            // console.log(`스포원 실외 ${time}시 ${courtMapOut[index]}번`);
            courtListOut.push(`${time}시 ${courtMapOut[index]}번`);
          }
        }
      } catch (e) {
        console.error('Error waiting for elements:', e);
      }
    }

    console.log(`스포원 조회 종료`)
    
    courtListOut.sort((a, b) => {
      const [aHour, aMinute] = a.split(' ')[0].split('시');
      const [bHour, bMinute] = b.split(' ')[0].split('시');
      return aHour - bHour || aMinute - bMinute;
    });

    return [courtListIn,courtListOut];
  } finally {
    await browser.close();
  }
}

module.exports = {spoCheck};

// async function spoCheckOut(targetMonth, targetDay){

//   //Browser Open (Chrome) (--Headlsess Optional not working)
//   let driver = await new Builder()
//     .forBrowser('chrome')
//     .setChromeOptions(new chrome.Options().addArguments(
//      "--headless",
//       "--disable-gpu",
//       "--no-sandbox",
//       "--window-size=1920,1080",
//       "--log-level=3"))
//     .build();
  
//   try {
//     //Set Implicit Wait time for 1 seconds.
//     await driver.manage().setTimeouts( { implicit: 1000 } );
    
//     //TargetMonth, Day to string with 0 (use padStart)
//     let targetMonthStr = targetMonth.toString().padStart(2, '0');
//     let targetDayStr = targetDay.toString().padStart(2, '0');
  
//     console.log('스포원 실외 : month :', targetMonthStr, 'day :', targetDayStr);

//     var Courtlist = [];

//     //Indoor Courtlist
//     const courtUrl = { 7: '1', 8: '2', 12: '3',13: '4',14: '5',15: '6', 16: '7', 17: '8', 18: '9',19: '10',20: '11'}
//     const indices = [7, 8, 12, 13, 14, 15, 16, 17, 18, 19, ];

//     for (let i = 0; i < indices.length; i++) {
//       const index = indices[i];
//       // Go to Reservation Site
//       await driver.get(`https://nrsv.spo1.or.kr/rent/reservation/index/2023/${targetMonthStr}/${targetDayStr}/1/SPOONE/15/${index}`);

//       // Wait for the page to finish loading (Maximum 10 seconds)
//       await driver.wait(until.urlContains(`https://nrsv.spo1.or.kr/rent/reservation/index/2023/${targetMonthStr}/${targetDayStr}/1/SPOONE/15/${index}`),10000);

//       //Check there is available court
//       try {
//         let checkBoxes = await driver.findElements(By.css('input[type="checkbox"].select_check'));
//         if (checkBoxes.length === 0) {
//           console.log(`${courtUrl[index]}번 예약 불가`);
//         } else{
//           for (let i = 0; i < checkBoxes.length; i++) {
//             let tr = await checkBoxes[i].findElement(By.xpath('ancestor::tr'));
//             let tds = await tr.findElements(By.tagName('td'));
//             let timeRange = await tds[2].getText();
//             let time = timeRange.split(' ')[0].substring(0,2);
//             console.log(`스포원 실외 ${time}시 ${courtUrl[index]}번`); // "06"
//             Courtlist.push(`${time}시 ${courtUrl[index]}번`);
//           }
//         }
//       } catch (e) {
//         console.error('Error waiting for elements:', e);
//       }
//       // let checkBoxes = await driver.findElements(By.css('input[type="checkbox"].select_check'));
//       // for (let i = 0; i < checkBoxes.length; i++) {
//       //   let tr = await checkBoxes[i].findElement(By.xpath('ancestor::tr'));
//       //   let tds = await tr.findElements(By.tagName('td'));
//       //   let timeRange = await tds[2].getText();
//       //   let time = timeRange.split(' ')[0].substring(0,2);
//       //   console.log(`스포원 실외 ${time}시 ${courtUrl[index]}번`); // "06"
//       //   Courtlist.push(`${time}시 ${courtUrl[index]}번`);
//       // }
//     }

//     console.log(`스포원 실외 조회 종료`);

//     //Sourting the courtlist to ascending by Hour
//     // convert times into time objects
//     const timeObjects = Courtlist.map(Courtlist => {
//       const [hour, minute] = Courtlist.split(' ')[0].split('시');
//       const timeObject = new Date();
//       timeObject.setHours(hour);
//       timeObject.setMinutes(minute);
//       return { time: Courtlist, timeObject: timeObject };
//     });

//     // sort timeObjects based on timeObject
//     timeObjects.sort((a, b) => a.timeObject - b.timeObject);

//     // display the sorted list
//     // timeObjects.forEach(item => console.log(item.time));
//     const sortedCourtList = timeObjects.map(item => item.time);

//     return sortedCourtList;
//     // return Courtlist;

//     // while(1);

//   }
//   finally {
//     await driver.quit();
//   }
// }
// //  spoCheckIn(3,6);
// //  spoCheckOut(3,6);

// module.exports = {spoCheckIn, spoCheckOut};