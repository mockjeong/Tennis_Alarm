require('chromedriver');
const {Builder, By, Key, until, StaleElementReferenceError } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function GooduckCheck(targetMonth, targetDay, url){

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
    await driver.get(url);

    //Wait until Current Month is Completely loaded
    await driver.wait(until.elementsLocated(By.css('.selectDay')),5000);
    // console.log('구덕 Wait Complete');

    await driver.wait(until.elementsLocated(By.css('.currentMonth')),5000);
    var curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
    var curMonth = parseInt(await curMonthElement.getText());

    // Search for Target Month
    while(curMonth != targetMonth){
      console.log('curMonth :', curMonth, 'targetMonth :', targetMonth);
      try {
        if(targetMonth > curMonth){
          await driver.wait(until.elementsLocated(By.className('btnMonth next')),5000);
          await driver.wait(until.elementIsEnabled(driver.findElement(By.className('btnMonth next'))), 5000);
          await driver.findElement(By.className('btnMonth next')).click();
          // console.log('구덕 next button clicked');
          
          //When get month data using getText() takes some time to implement
          curMonth += 1;

          // await driver.wait(until.elementsLocated(By.css('.currentMonth')),5000);
          // await driver.wait(new Promise(resolve => setTimeout(resolve, 500)));
          // curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
          // curMonth = parseInt(await curMonthElement.getText());
        } else {
          await driver.wait(until.elementsLocated(By.className('btnMonth prev')),5000);
          await driver.wait(until.elementIsEnabled(driver.findElement(By.className('btnMonth prev'))), 5000);
          await driver.findElement(By.className('btnMonth prev')).click();
          // console.log('구덕 prev button clicked');

          //When get month data using getText() takes some time to implement
          curMonth -= 1;

          // await driver.wait(until.elementsLocated(By.css('.currentMonth')),5000);
          // await driver.wait(new Promise(resolve => setTimeout(resolve, 500)));
          // curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
          // curMonth = parseInt(await curMonthElement.getText());
        }
      } catch (error) {
        if (error && error instanceof StaleElementReferenceError) {
          // console.log('구덕 Element is stale, re-locating...');
          curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
          curMonth = parseInt(await curMonthElement.getText());
        } else {
          throw error;
        }
      }
    }

    //Click the target date
    await driver.wait(new Promise(resolve => setTimeout(resolve, 500)));
    var dateSelectXpath = `//a[contains(text(), '${targetDay}')]`
    await driver.wait(until.elementLocated(By.xpath(dateSelectXpath)), 5000);
    await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath(dateSelectXpath))), 5000);
    await driver.findElement(By.xpath(dateSelectXpath)).click();

    await driver.wait(new Promise(resolve => setTimeout(resolve, 500)));
    const reserveApplyElements = await driver.findElements(By.xpath('//*[@id="beginTime"]/option'));

    var Courtlist = [];
    
    for (const reserveApplyElement of reserveApplyElements) {
      var startTimeText = await reserveApplyElement.getText();
      if(startTimeText=='선택' || startTimeText.substring(startTimeText.length - 4)=='[마감]'){

      }
      else{
        console.log(`구덕 ${startTimeText.substring(0, 2)}시`);
        Courtlist.push(`${startTimeText.substring(0, 2)}시`);
      }
    }
    console.log(`구덕 조회 종료`);
    return Courtlist;
  }
  finally {
    await driver.quit();
  }
}

// GooduckCheck(3,3,'https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=290#');

module.exports = {GooduckCheck};