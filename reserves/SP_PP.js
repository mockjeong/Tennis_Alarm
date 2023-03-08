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

  // Set a timeout to close the browser
  setTimeout(() => {
    browser.close();
  }, 60000);
  
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