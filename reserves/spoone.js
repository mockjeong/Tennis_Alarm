require('chromedriver');
const { constants } = require('fs/promises');
const {Builder, By, Key, until, StaleElementReferenceError } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function spoCheck(targetMonth, targetDay){

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
    
    // //Go to Homepage (Spoone)
    // await driver.get('https://www.spo1.or.kr/main/main.do');

    // // Get the current window handle
    // const mainWindowHandle = await driver.getWindowHandle();

    // const loginxbtnpath = '/html/body/div/div[1]/div/div[2]/div[2]/ul/li[2]/a'
    // let loginbtnElement = await driver.wait(until.elementLocated(By.xpath(loginxbtnpath)), 10000);
    // await driver.wait(until.elementIsEnabled(loginbtnElement), 10000);
    // await driver.findElement(By.xpath(loginxbtnpath)).click();

    // // Wait for the popup window to appear
    // await driver.wait(async () => {
    //   const handles = await driver.getAllWindowHandles();
    //   return handles.length > 1;
    // }, 5000);

    // // Switch to the popup window
    // const handles = await driver.getAllWindowHandles();
    // const popupWindowHandle = handles.find(handle => handle !== mainWindowHandle);
    // await driver.switchTo().window(popupWindowHandle);

    // //Login Information
    // // Notice : If keyboard secure utility is installed, sendkeys for id is impossible.
    // // Uninstall the Keyboard secure utility
    // const userId = 'jeongmock';
    // const userPwd = 'dbwjdahr11!';
    // await driver.findElement(By.id('textfield01')).sendKeys(userId);
    // await driver.findElement(By.id('textfield02')).sendKeys(userPwd);

    // const loginxpath = '/html/body/div/div[2]/div[2]/div/div[1]/form/fieldset/p[2]/input'
    // let loginElement = await driver.wait(until.elementLocated(By.xpath(loginxpath)), 10000);
    // await driver.wait(until.elementIsEnabled(loginElement), 10000);
    // await driver.findElement(By.xpath(loginxpath)).click();

    // // Switch back to the main window
    // await driver.switchTo().window(mainWindowHandle);

    //TargetMonth, Day to string with 0 (use padStart)
    let targetMonthStr = targetMonth.toString().padStart(2, '0');
    let targetDayStr = targetDay.toString().padStart(2, '0');
  
    console.log('month :', targetMonthStr, 'day :', targetDayStr);

    const courtUrl = { 21: '실내1', 22: '실내2', 23: '실내3',24: '실내4',25: '실내5',26: '실내6'}
    const indices = [21, 22, 23, 24, 25, 26];

    var Courtlist = [];

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
        console.log(time); // "06"
        Courtlist.push(`${time}시 ${courtUrl[index]}번`);
      }
    }



    //실내 : https://nrsv.spo1.or.kr/rent/application/index/2023/02/22/1/SPOONE/11/21
    // await driver.wait(until.elementsLocated(By.css('.currentMonth')),5000);
    // var curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
    // var curMonth = parseInt(await curMonthElement.getText());

    

    // // Search for Target Month
    // while(curMonth != targetMonth){
    //   console.log('curMonth :', curMonth, 'targetMonth :', targetMonth);
    //   try {
    //     if(targetMonth > curMonth){
    //       await driver.wait(until.elementsLocated(By.className('btnMonth next')),5000);
    //       await driver.wait(until.elementIsEnabled(driver.findElement(By.className('btnMonth next'))), 5000);
    //       await driver.findElement(By.className('btnMonth next')).click();
    //       console.log('next button clicked');
          
    //       //When get month data using getText() takes some time to implement
    //       curMonth += 1;

    //       // await driver.wait(until.elementsLocated(By.css('.currentMonth')),5000);
    //       // await driver.wait(new Promise(resolve => setTimeout(resolve, 500)));
    //       // curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
    //       // curMonth = parseInt(await curMonthElement.getText());
    //     } else {
    //       await driver.wait(until.elementsLocated(By.className('btnMonth prev')),5000);
    //       await driver.wait(until.elementIsEnabled(driver.findElement(By.className('btnMonth prev'))), 5000);
    //       await driver.findElement(By.className('btnMonth prev')).click();
    //       console.log('prev button clicked');

    //       //When get month data using getText() takes some time to implement
    //       curMonth -= 1;

    //       // await driver.wait(until.elementsLocated(By.css('.currentMonth')),5000);
    //       // await driver.wait(new Promise(resolve => setTimeout(resolve, 500)));
    //       // curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
    //       // curMonth = parseInt(await curMonthElement.getText());
    //     }
    //   } catch (error) {
    //     if (error && error instanceof StaleElementReferenceError) {
    //       console.log('Element is stale, re-locating...');
    //       curMonthElement = await driver.findElement(By.css('.currentMonth em:last-child'));
    //       curMonth = parseInt(await curMonthElement.getText());
    //     } else {
    //       throw error;
    //     }
    //   }
    // }

    // //Click the target date
    // await driver.wait(new Promise(resolve => setTimeout(resolve, 500)));
    // var dateSelectXpath = `//a[contains(text(), '${targetDay}')]`
    // await driver.wait(until.elementLocated(By.xpath(dateSelectXpath)), 5000);
    // await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath(dateSelectXpath))), 5000);
    // await driver.findElement(By.xpath(dateSelectXpath)).click();

    // await driver.wait(new Promise(resolve => setTimeout(resolve, 500)));
    // const reserveApplyElements = await driver.findElements(By.xpath('//*[@id="beginTime"]/option'));

    // var Courtlist = [];
    
    // for (const reserveApplyElement of reserveApplyElements) {
    //   var startTimeText = await reserveApplyElement.getText();
    //   if(startTimeText=='선택' || startTimeText.substring(startTimeText.length - 4)=='[마감]'){

    //   }
    //   else{
    //     Courtlist.push(`${startTimeText.substring(0, 2)}시`);
    //   }
    // }
    // return Courtlist;
  
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
spoCheck(2,28);

module.exports = {spoCheck};