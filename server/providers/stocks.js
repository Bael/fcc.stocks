const request = require('async-request');
require('dotenv').config();



async function getStocksBySymbol(symbol) {

    let response;
    let API_KEY = process.env.APIKEY;
    try {

        const baseUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;

        console.log(baseUrl);
        let raw = await request(baseUrl);

        let jsonBody = JSON.parse(raw.body)
        let series = jsonBody["Time Series (Daily)"];
        //console.log(jsonBody);
        //console.log(series);
        let values = [];
        Object.getOwnPropertyNames(series).sort().forEach(function(val, idx, array) {
            console.log(val + ' -> ' + series[val]);
            values.push({x:new Date(val).getTime(), y:series[val]["4. close"]});
          });

        response = {values, key:symbol, color:"#0000ff"};

    } catch (e) {
        console.log(e);
    }

    return response;

}


module.exports.getStocksBySymbol = getStocksBySymbol;