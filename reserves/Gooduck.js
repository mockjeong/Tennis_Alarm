require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function GooduckCheck(targetMonth, targetDay){

  //Browser Open (Chrome) (--Headlsess Optional not working)
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments(
      // "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--window-size=1920,1080",
      "--log-level=3"))
    .build();
  
  try {
    //Set Implicit Wait time for 5 seconds.
    await driver.manage().setTimeouts( { implicit: 5000 } );
    
    //Go to Reservation Site (Sajick)
    await driver.get('https://www.busan.go.kr/member/login');

    //Login Information
    // Notice : If keyboard secure utility is installed, sendkeys for id is impossible.
    // Uninstall the Keyboard secure utility
    const userId = 'jeongmock';
    const userPwd = 'dbwjdahr11!';
    await driver.findElement(By.id('mberId')).sendKeys(userId);
    await driver.findElement(By.id('mberPwd')).sendKeys(userPwd);

    const loginxpath = '/html/body/div[2]/div[2]/div/div/div[1]/div[1]/form/div/button'
    let loginElement = await driver.wait(until.elementLocated(By.xpath(loginxpath)), 10000);
    await driver.wait(until.elementIsEnabled(loginElement), 10000);
    await driver.findElement(By.xpath(loginxpath)).click();

    // //Go to Reservation Site
    await driver.get('https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=289');

    var curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
    var curMonth = parseInt(await curMonthElement.getText());

    // Search for Target Month
    while(curMonth != targetMonth){
      try {
        if(targetMonth > curMonth){
          await driver.wait(until.elementsLocated(By.className('btnMonth next')),5000);
          await driver.findElement(By.className('btnMonth next')).click();
          curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
          curMonth = parseInt(await curMonthElement.getText());
        } else {
          await driver.wait(until.elementsLocated(By.className('btnMonth prev')),5000);
          await driver.findElement(By.className('btnMonth prev')).click();
          curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
          curMonth = parseInt(await curMonthElement.getText());
        }
      } catch (error) {
        if (error instanceof StaleElementReferenceError) {
          console.log('Element is stale, re-locating...');
          curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
          curMonth = parseInt(await curMonthElement.getText());
        } else {
          throw error;
        }
      }
    }

    var dateSelectXpath = `//a[contains(text(), '${targetDay}')]`
    let dateSelectElement = await driver.wait(until.elementLocated(By.xpath(dateSelectXpath)), 8000);
    await driver.wait(until.elementIsEnabled(dateSelectElement), 10000);
    const element = await driver.findElement(By.xpath(dateSelectXpath));
    await element.click();
    // const DayElement = await driver.findElement(By.css('.selectDay a'));
    const DayElement = await driver.findElement(By.css('.selectDay a'));
    const DayText = await DayElement.getText();

    await console.log('Day:',DayText);
  
    // await driver.wait(until.elementsLocated(By.xpath('//th[text()="구분"]'),20000));

    // await console.log('Table Ready');

    // var dateSelectXpath = `//label[contains(text(),'0${targetMonth}월 ${targetDay}일')]`
    // let dateSelectElement = await driver.wait(until.elementLocated(By.xpath(dateSelectXpath)), 8000);
    // await driver.wait(until.elementIsEnabled(dateSelectElement), 10000);
    // const element = await driver.findElement(By.xpath(dateSelectXpath));
    // await element.click();

    // // Wait for 5 seconds
    // await driver.wait(new Promise(resolve => setTimeout(resolve, 5000)));

    // await console.log('Date Selected');

    // const calendarBody = await driver.findElement(By.css('div.calendar-body.pc'));
    // const reserveApplyElements = await calendarBody.findElements(By.className('chk_court'));

    var Courtlist = [];
    // console.log(`${targetMonth}월 ${targetDay}일의 예약 가능 시간/코트`)
    // Loop through the elements and extract the values of the checkboxes
    // for (const reserveApplyElement of reserveApplyElements) {
    //   // const checkboxElement = await reserveApplyElement.findElement(By.className('chk_court'));
    //   const checkboxValue = await reserveApplyElement.getAttribute('value');
    //   const parts = checkboxValue.split('|');
    //   const courtNum = parts[0].substr(3);
    //   const startTime = parseInt(parts[1].substr(2))+5;

    //   // console.log(`${startTime}시 ${courtNum}번`);
    //   Courtlist.push(`${startTime}시 ${courtNum}번`);

    // }
    // return Courtlist;

    while(1);
  }
  finally {
    await driver.quit();
  }
}

GooduckCheck(3,3);

module.exports = {GooduckCheck};