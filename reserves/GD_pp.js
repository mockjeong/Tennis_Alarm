const puppeteer = require('puppeteer');

async function gdCheck(targetMonth, targetDay) {
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
  await page.goto('https://www.busan.go.kr/member/login');

  const userId = 'jeongmock';
  const userPwd = 'dbwjdahr11!';

  await page.type('#mberId', userId);
  await page.type('#mberPwd', userPwd);

  await page.waitForSelector('button[type="submit"]');
  await page.click('button[type="submit"]');

  var url1 = 'https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=289#';
  var url2 = 'https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=290#';
  var url3 = 'https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=291#';

  await page.goto(url1);

  //Wait until Current Month is Completely loaded
  await page.waitForSelector('.selectDay', { timeout: 5000 });

  //Wait until Current Month is Completely loaded
  await page.waitForSelector('.currentMonth', { timeout: 5000 });
  let curMonth = await page.evaluate(() => parseInt(document.querySelector('.currentMonth em:last-child').textContent));
//  console.log('curMonth :', curMonth, 'targetMonth :', targetMonth);

  while (curMonth !== targetMonth){
    if (targetMonth > curMonth) {
      const nextButton = await page.waitForSelector('.btnMonth.next');
      await nextButton.click();
      curMonth += 1;
    } else {
      const prevButton = await page.waitForSelector('.btnMonth.prev');
      await prevButton.click();
      curMonth -= 1;
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  let dateSelectXpath = `//a[contains(text(), '${targetDay}')]`;
  await page.waitForXPath(dateSelectXpath);
  let dateElement = await page.$x(dateSelectXpath);
  await dateElement[0].click();

  await page.waitForSelector('#beginTime');

  const Courtlist1 = await page.evaluate(() => {
    const reserveApplyElements = [...document.querySelectorAll('#beginTime > option')];
    return reserveApplyElements.reduce((acc, curr) => {
      const startTimeText = curr.textContent;
      if (startTimeText !== '선택' && !startTimeText.endsWith('[마감]')) {
        const court = startTimeText.substring(0, 2) + '시';
        acc.push(court);
      }
      return acc;
    }, []);
  });

  await page.goto(url2);

  //Wait until Current Month is Completely loaded
  await page.waitForSelector('.selectDay', { timeout: 5000 });

  //Wait until Current Month is Completely loaded
  await page.waitForSelector('.currentMonth', { timeout: 5000 });
  curMonth = await page.evaluate(() => parseInt(document.querySelector('.currentMonth em:last-child').textContent));
//  console.log('curMonth :', curMonth, 'targetMonth :', targetMonth);

  while (curMonth !== targetMonth){
    if (targetMonth > curMonth) {
      const nextButton = await page.waitForSelector('.btnMonth.next');
      await nextButton.click();
      curMonth += 1;
    } else {
      const prevButton = await page.waitForSelector('.btnMonth.prev');
      await prevButton.click();
      curMonth -= 1;
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  dateSelectXpath = `//a[contains(text(), '${targetDay}')]`;
  await page.waitForXPath(dateSelectXpath);
  dateElement = await page.$x(dateSelectXpath);
  await dateElement[0].click();

  await page.waitForSelector('#beginTime');

  const Courtlist2 = await page.evaluate(() => {
    const reserveApplyElements = [...document.querySelectorAll('#beginTime > option')];
    return reserveApplyElements.reduce((acc, curr) => {
      const startTimeText = curr.textContent;
      if (startTimeText !== '선택' && !startTimeText.endsWith('[마감]')) {
        const court = startTimeText.substring(0, 2) + '시';
        acc.push(court);
      }
      return acc;
    }, []);
  });

  await page.goto(url3);

  //Wait until Current Month is Completely loaded
  await page.waitForSelector('.selectDay', { timeout: 5000 });

  //Wait until Current Month is Completely loaded
  await page.waitForSelector('.currentMonth', { timeout: 5000 });
  curMonth = await page.evaluate(() => parseInt(document.querySelector('.currentMonth em:last-child').textContent));
 // console.log('curMonth :', curMonth, 'targetMonth :', targetMonth);

  while (curMonth !== targetMonth){
    if (targetMonth > curMonth) {
      const nextButton = await page.waitForSelector('.btnMonth.next');
      await nextButton.click();
      curMonth += 1;
    } else {
      const prevButton = await page.waitForSelector('.btnMonth.prev');
      await prevButton.click();
      curMonth -= 1;
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  dateSelectXpath = `//a[contains(text(), '${targetDay}')]`;
  await page.waitForXPath(dateSelectXpath);
  dateElement = await page.$x(dateSelectXpath);
  await dateElement[0].click();

  await page.waitForSelector('#beginTime');

  const Courtlist3 = await page.evaluate(() => {
    const reserveApplyElements = [...document.querySelectorAll('#beginTime > option')];
    return reserveApplyElements.reduce((acc, curr) => {
      const startTimeText = curr.textContent;
      if (startTimeText !== '선택' && !startTimeText.endsWith('[마감]')) {
        const court = startTimeText.substring(0, 2) + '시';
        acc.push(court);
      }
      return acc;
    }, []);
  });

  await browser.close();
  console.log(`1번 코트 : ${Courtlist1}, 2번 코트 : ${Courtlist2}, 3번 코트 : ${Courtlist3}`);
  console.log('구덕 조회 종료');
  return [Courtlist1,Courtlist2,Courtlist3];
}
 module.exports = {gdCheck};
// Result = gdCheck(3,8);
// console.log(Result[0])