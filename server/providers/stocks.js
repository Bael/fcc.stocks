const request = require('async-request');
require('dotenv').config();



async function getStocksBySymbol(symbol) {

    let response;
    let API_KEY = process.env.APIKEY;
    try {

        const baseUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${API_KEY}`;

        response = await request(baseUrl);

    } catch (e) {
        console.log(e);
    }

    return response;

}


module.exports.getStocksBySymbol = getStocksBySymbol;