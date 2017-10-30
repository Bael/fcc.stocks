const request = require('async-request');
require('dotenv').config();



async function getStocksBySymbol(symbol) {

    let response = [];
    let API_KEY = process.env.APIKEY;
    try {

        const baseUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${API_KEY}`;

        let raw = await request(baseUrl);

        let jsonBody = JSON.parse(raw.body)
        let series = jsonBody["Time Series (1min)"];
        console.log(jsonBody);
        console.log(series);

        Object.getOwnPropertyNames(series).sort().forEach(function(val, idx, array) {
            console.log(val + ' -> ' + series[val]);
            response.push({x:new Date(val).getTime(), y:series[val]["4. close"]});
          });

        

    } catch (e) {
        console.log(e);
    }

    return response;

}


module.exports.getStocksBySymbol = getStocksBySymbol;