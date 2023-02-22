require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function sajickCheck(targetMonth, targetDay){

  //Browser Open (Chrome) (--Headlsess Optional not working)
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments(
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--window-size=800,600",
      "--log-level=3"))
    .build();
  
  try {
    //Set Implicit Wait time for 5 seconds.
    await driver.manage().setTimeouts( { implicit: 5000 } );
    
    //Go to Reservation Site (Sajick)
    await driver.get('https://sajiktennis.kr/login');

    //Login Information for test
    const userId = 'jeongmock';
    const userPwd = 'dbwjdahr11';
    await driver.findElement(By.id('m_id')).sendKeys(userId);
    await driver.findElement(By.id('m_pass')).sendKeys(userPwd);

    //Login Error Occured when window size is large.
    //Login First and maxmize window size (Should be monitored.)
    var loginxpath = '/html/body/div[5]/div[3]/div[3]/div/div[2]/div[2]/div/form/fieldset/ul[1]/li[3]/button'
    let loginElement = await driver.wait(until.elementLocated(By.xpath(loginxpath)), 10000);
    await driver.wait(until.elementIsEnabled(loginElement), 10000);
    await driver.findElement(By.xpath(loginxpath)).click();

    //Edit WindowSize to 1920x1080 it will show all tennis court information
    await driver.manage().window().setRect({width: 1920, height: 1080});

    //Go to Reservation Site
    await driver.get('https://sajiktennis.kr/html/?pCode=7');

    await driver.wait(until.elementsLocated(By.xpath('//th[text()="구분"]'),20000));

    await console.log('Table Ready');

    var dateSelectXpath = `//label[contains(text(),'0${targetMonth}월 ${targetDay}일')]`
    let dateSelectElement = await driver.wait(until.elementLocated(By.xpath(dateSelectXpath)), 8000);
    await driver.wait(until.elementIsEnabled(dateSelectElement), 10000);
    const element = await driver.findElement(By.xpath(dateSelectXpath));
    await element.click();

    // Wait for 5 seconds
    await driver.wait(new Promise(resolve => setTimeout(resolve, 5000)));

    await console.log('Date Selected');

    const calendarBody = await driver.findElement(By.css('div.calendar-body.pc'));
    const reserveApplyElements = await calendarBody.findElements(By.className('chk_court'));

    // var Courtlist = '<ul>';
    // console.log(`${targetMonth}월 ${targetDay}일의 예약 가능 시간/코트`)
    // // Loop through the elements and extract the values of the checkboxes
    // for (const reserveApplyElement of reserveApplyElements) {
    //   // const checkboxElement = await reserveApplyElement.findElement(By.className('chk_court'));
    //   const checkboxValue = await reserveApplyElement.getAttribute('value');
    //   const parts = checkboxValue.split('|');
    //   const courtNum = parts[0].substr(3);
    //   const startTime = parseInt(parts[1].substr(2))+5;

    //   console.log(`${startTime}시 ${courtNum}번`);
    //   Courtlist = Courtlist + `<li>${startTime}시 ${courtNum}번</li>`;

    // }
    // Courtlist = Courtlist+ '</ul>';
    // return Courtlist;

    var Courtlist = [];
    // console.log(`${targetMonth}월 ${targetDay}일의 예약 가능 시간/코트`)
    // Loop through the elements and extract the values of the checkboxes
    for (const reserveApplyElement of reserveApplyElements) {
      // const checkboxElement = await reserveApplyElement.findElement(By.className('chk_court'));
      const checkboxValue = await reserveApplyElement.getAttribute('value');
      const parts = checkboxValue.split('|');
      var courtNum = parts[0].substr(3);
      if (courtNum == '0') courtNum = '10';
      const startTime = parseInt(parts[1].substr(2))+5;

      // console.log(`${startTime}시 ${courtNum}번`);
      Courtlist.push(`${startTime}시 ${courtNum}번`);

    }
    return Courtlist;
  }
  finally {
    await driver.quit();
  }
}

module.exports = {sajickCheck};