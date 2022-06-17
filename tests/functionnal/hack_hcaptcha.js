import axios from "axios"



const headers = {
    "Host": "hcaptcha.com",
    "Connection": "keep-alive",
    "sec-ch-ua": 'Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92',
    "Accept": "application/json",
    "sec-ch-ua-mobile": "?0",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
    "Content-type": "application/json; charset=utf-8",
    "Origin": "https://newassets.hcaptcha.com",
    "Sec-Fetch-Site": "same-site",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Referer": "https://newassets.hcaptcha.com/",
    "Accept-Language": "en-US,en;q=0.9"
}

const reqData = async (siteKey, host, proxy) => {
    let url = `https://hcaptcha.com/checksiteconfig?host=${host}&sitekey=${siteKey}&sc=1&swa=1"`

    return await axios({
        url: url,
        config: {
            headers: headers,
        },
        proxy: {
            host: "localhost",
        }
    })
    .then(response => {
        return response.data
    })
    .catch(err => {
        console.log(err)
        return null
    })
    //, headers=headers,proxies={"https://": f"http://${proxy}"}`
}

const bypass = (siteKey, host, proxy) => {
    let request = reqData(siteKey, host, proxy)
}




let a = await reqData("111", "222", "333")
console.log(a)