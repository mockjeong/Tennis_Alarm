require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
//const webdriver = require('selenium-webdriver');
//const { Options } = require('selenium-webdriver/chrome');


async function sajickCheck(){
 // const chromeService = new chrome.ServiceBuilder().build();
 // chrome.setDefaultService(chromeService);

  //Browser Open (Chrome) (--Headlsess Optional not working)
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments("--window-size=800,600"))
    // .setChromeOptions(new chrome.Options().addArguments(
    //   "--headless",
    //   "--disable-gpu",
    //   "--no-sandbox",
    //   "--window-size=800,600"))
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
    await driver.findElement(By.xpath('/html/body/div[5]/div[3]/div[3]/div/div[2]/div[2]/div/form/fieldset/ul[1]/li[3]/button')).click();

    await driver.manage().window().maximize();

    //Go to Reservation Site
    await driver.get('https://sajiktennis.kr/html/?pCode=7');

    const targetMonth = 02;
    const targetDay = 19;

    await driver.wait(until.elementsLocated(By.xpath('//th[text()="구분"]'),20000));
    // await driver.wait(until.elementsLocated(By.css('tbody .reserve-apply')), 20000);

    await console.log('Table Ready');

    const element = await driver.findElement(By.xpath(`//label[contains(text(),'${targetMonth}월 ${targetDay}일')]`));
    await element.click();

    // Wait for 5 seconds
    await driver.wait(new Promise(resolve => setTimeout(resolve, 5000)));

    await console.log('Date Selected');

    const calendarBody = await driver.findElement(By.css('div.calendar-body.pc'));
    const reserveApplyElements = await calendarBody.findElements(By.className('chk_court'));

    var Courtlist = '<ul>';
    console.log(`${targetMonth}월 ${targetDay}일의 예약 가능 시간/코트`)
    // Loop through the elements and extract the values of the checkboxes
    for (const reserveApplyElement of reserveApplyElements) {
      // const checkboxElement = await reserveApplyElement.findElement(By.className('chk_court'));
      const checkboxValue = await reserveApplyElement.getAttribute('value');
      const parts = checkboxValue.split('|');
      const courtNum = parts[0].substr(3);
      const startTime = parseInt(parts[1].substr(2))+5;

      console.log(`${startTime}시 ${courtNum}번`);
      Courtlist = Courtlist + `<li>${startTime}시 ${courtNum}번</li>`;

    }
    Courtlist = Courtlist+ '</ul>';
    return Courtlist;
  }
  finally {
    await driver.quit();
  }
}

module.exports = {sajickCheck};