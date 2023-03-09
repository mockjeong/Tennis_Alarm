const puppeteer = require('puppeteer');

async function spoInCheck(targetMonth, targetDay) {
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
        page.goto(`https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=2023${targetMonthStr}${targetDayStr}&rent_type=1001&center=SPOONE&part=11&place=${index}#regist_list`),
      ]);

      try{
        await page.waitForSelector('.txtcenter');
        let checkboxes = await page.$x("//td[text()='예약가능']");
        if (checkboxes.length === 0) {
          // console.log(`실내 ${courtMapIn[index]}번 예약 불가`);
        } else {
          for (const checkbox of checkboxes) {
            const tr = await checkbox.$('xpath=ancestor::tr');
            const tds = await tr.$$('td');
            const timeRange = await tds[2].evaluate((td) => td.innerText);
            const time = timeRange.split(' ')[0].substring(0, 2);
            courtListIn.push({
              courtNum : courtMapIn[index],
              startTime : time
            })
          }
        }
      } catch (e) {
        console.error('Error waiting for elements:', e);
      }
    }

    courtListIn.sort((a, b) => a.courtNum - b.courtNum);

    // Group the results by courtNum
    const groupedResults = courtListIn.reduce((acc, curr) => {
      const index = acc.findIndex(item => item.courtNum === curr.courtNum);
      if (index === -1) {
        acc.push({ courtNum: curr.courtNum, startTimes: [curr.startTime] });
      } else {
        acc[index].startTimes.push(curr.startTime);
      }
      return acc;
    }, []);

    console.log(`스포원 실내 조회 종료`)

    return groupedResults;

  } finally {
    await browser.close();
  }
}

async function spoOutCheck(targetMonth, targetDay) {
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

    var courtListOut = [];

    //Indoor Courtlist
    const courtMapOut = { 7: '1', 8: '2', 12: '3',13: '4',14: '5',15: '6', 16: '7', 17: '8', 18: '9',19: '10',20: '11'}
    const indicesOut = [7, 8, 12, 13, 14, 15, 16, 17, 18, 19, ];

    console.log(`스포원 실외 조회 중...`)

    for (let i = 0; i < indicesOut.length; i++) {
      const index = indicesOut[i];

      await Promise.all([
        page.waitForNavigation({ timeout: 10000 }),
        page.goto(`https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=2023${targetMonthStr}${targetDayStr}&rent_type=1001&center=SPOONE&part=15&place=${index}#regist_list`),
      ]);

      try{
        await page.waitForSelector('.txtcenter');
        let checkboxes = await page.$x("//td[text()='예약가능']");
        if (checkboxes.length === 0) {
          // console.log(`실외 ${courtMapOut[index]}번 예약 불가`);
        } else {
          for (const checkbox of checkboxes) {
            const tr = await checkbox.$('xpath=ancestor::tr');
            const tds = await tr.$$('td');
            const timeRange = await tds[2].evaluate((td) => td.innerText);
            const time = timeRange.split(' ')[0].substring(0, 2);
            // console.log(`스포원 실외 ${time}시 ${courtMapOut[index]}번`);
            courtListOut.push({
              courtNum : courtMapOut[index],
              startTime : time
            })
          }
        }
      } catch (e) {
        console.error('Error waiting for elements:', e);
      }
    }

    courtListOut.sort((a, b) => a.courtNum - b.courtNum);

    // Group the results by courtNum
    const groupedResults = courtListOut.reduce((acc, curr) => {
      const index = acc.findIndex(item => item.courtNum === curr.courtNum);
      if (index === -1) {
        acc.push({ courtNum: curr.courtNum, startTimes: [curr.startTime] });
      } else {
        acc[index].startTimes.push(curr.startTime);
      }
      return acc;
    }, []);

    console.log(`스포원 실외 조회 종료`)

    return groupedResults;

  } finally {
    await browser.close();
  }
}

module.exports = {spoInCheck, spoOutCheck};