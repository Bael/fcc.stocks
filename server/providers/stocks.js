const request = require('async-request');
require('dotenv').config();
const symbols = require('../providers/symbol');


async function getStocksBySymbol(symbol) {

    let response;
    let API_KEY = process.env.APIKEY;
    try {

        const baseUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;

        console.log(baseUrl);
        let raw = await request(baseUrl);

        let jsonBody = JSON.parse(raw.body)
        console.log(jsonBody);
        if (jsonBody.hasOwnProperty('Error Message'))
        {
            throw new Error('wrong symbol!');
        }
        let series = jsonBody["Time Series (Daily)"];
        //console.log(jsonBody);
        //console.log(series);
        let values = [];
        Object.getOwnPropertyNames(series).sort().forEach(function(val, idx, array) {
            console.log(val + ' -> ' + series[val]);
            values.push({x:val, y:series[val]["4. close"]});
          });

        response = {values, key:symbol, color:"#0000ff"};

    } catch (e) {
        console.log(e);
        throw e;
    }

    return response;

}


async function getCurrentStocks() {
        let response = [];
        
        let currentStocks = await symbols.getSymbols();

        for (var i=0; i<currentStocks.length; i++) {
            let symbolData = await getStocksBySymbol(currentStocks[i]);
            response.push(symbolData);
        }
        
    
    return response;
}
    

async function addSymbol(symbol) {
    let symbolData = {};

    try {
        
        symbolData = await getStocksBySymbol(symbol);

        let symbolid = await symbols.addSymbol(symbol);
        console.log("symbol added " + symbol);

    
    }
    catch (e) {
        console.log(e);
        throw e;
    }
    return symbolData;
}


async function removeSymbol(symbol) {
    
    await symbols.removeSymbol(symbol);
    
    return true;
}

module.exports.getStocksBySymbol = getStocksBySymbol;
module.exports.getCurrentStocks = getCurrentStocks;
module.exports.addSymbol = addSymbol;
module.exports.removeSymbol = removeSymbol;
