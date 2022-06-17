require("dotenv").config()
const CONFIG = process.env;

const {Builder, By, Key, until, WebDriver} = require('selenium-webdriver');
const { Driver } = require('selenium-webdriver/chrome');


async function connect(driver, user_token) {
    await driver.executeScript('function login(e) {setInterval(()=>{document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token=`"${e}"`},50); setTimeout(()=>{location.reload()}, 2500)}; login("' + user_token + '");')
}


(async function example() {


let url = "https://discord.com/login"

let searchString = "test"
let driver = await new Builder()
    .forBrowser("chrome")
    .build()

await driver.get(url)
await connect(driver, CONFIG.DISCORD_USER_TOKEN)
// await driver.get(url)

if ( CONFIG.AUTO_CLOSE === true ) {
    await driver.sleep(3000)
    await driver.quit()
}

})();
