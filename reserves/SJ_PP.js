const puppeteer = require('puppeteer');

async function sjCheck(targetMonth, targetDay){

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu-sandbox',
    ],
  });

  // Set a timeout to close the browser
  setTimeout(() => {
    browser.close();
  }, 60000);

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });

  //TargetMonth, Day to string with 0 (use padStart)
  let targetMonthStr = targetMonth.toString().padStart(2, '0');
  let targetDayStr = targetDay.toString().padStart(2, '0');
  
  try {
    await page.goto('https://sajiktennis.kr/login');

    //Login Information for test
    const userId = 'jeongmock';
    const userPwd = 'dbwjdahr11';
    await page.type('#m_id', userId);
    await page.type('#m_pass', userPwd);
    await page.waitForSelector('button[type="submit"]');
    await page.click('button[type="submit"]');
    console.log(`사직 조회 시작`);

    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://sajiktennis.kr/html/?pCode=7');

    // console.log(`사직 조회 중...`);

    await page.waitForSelector('div.calendar-body.pc > table');

    const dateSelectXpath = `//label[contains(text(),'${targetMonthStr}월 ${targetDayStr}일')]`;
    await page.waitForXPath(dateSelectXpath);

    const [dateSelectElement] = await page.$x(dateSelectXpath);
    await dateSelectElement.click();

    await page.waitForSelector('div.calendar-body.pc > table');
    const reserveApplyElements = await page.$$('.calendar-body table tbody td input[type="checkbox"]');

    var Courtlist = [];

    for (const reserveApplyElement of reserveApplyElements) {
      const checkboxValue = await reserveApplyElement.evaluate(node => node.getAttribute('value'));
      const parts = checkboxValue.split('|');
      const courtNum = parts[0].substr(3) === '0' ? '10' : parts[0].substr(3);
      const startTime = parseInt(parts[1].substr(2)) + 5;
      // Courtlist.push(`${startTime}시 ${courtNum}번`);
      Courtlist.push({
        courtNum: courtNum,
        startTime: startTime
      });
    }

    // Sort the array by courtNum in ascending order
    Courtlist.sort((a, b) => a.courtNum - b.courtNum);

    // Group the results by courtNum
    const groupedResults = Courtlist.reduce((acc, curr) => {
      const index = acc.findIndex(item => item.courtNum === curr.courtNum);
      if (index === -1) {
        acc.push({ courtNum: curr.courtNum, startTimes: [curr.startTime] });
      } else {
        acc[index].startTimes.push(curr.startTime);
      }
      return acc;
    }, []);

    console.log(`사직 조회 종료`);
    return groupedResults;
  }
  finally {
    await browser.close();
  }
}

// sjCheck(3,8);

module.exports = {sjCheck};