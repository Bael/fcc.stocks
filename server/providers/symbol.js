const sqlite3 = require('sqlite3').verbose();

  // Promises to add symbol
function addSymbol(symbolid, isactive, descritpion, callback) {
    return new Promise (function(resolve, reject) {

        var db = getDB();
        let id = "";
        db.serialize(function () {
            db.run("CREATE TABLE IF NOT EXISTS symbol (symbolid TEXT, isactive INTEGER, description TEST)");
            var stmt = db.prepare("INSERT INTO symbol (symbolid, isactive, description) VALUES (?, ?, ?) ");
            stmt.run(symbolid, isactive, descritpion, function (err, lastID) {
                if (err) {
                    reject(err);
                } else { 
                    id = this.lastID;
                }
            });
            stmt.finalize();
        });
    
        db.close((err) => {
            if (err) { reject(err); }
             else { resolve(id); }
          
        });
    });

}


// Promises to get symbols
function getSymbols(callback) {
    return new Promise(function(resolve, reject) {

        var db = getDB();
        let symbols = [];
        db.serialize(function () {
            db.run("CREATE TABLE IF NOT EXISTS symbol (symbolid TEXT, isactive INTEGER, description TEST)")
            .each("SELECT symbolid from symbol ",
            (err, row) => {
                 if (err) {
                     console.log(err);
                     return reject(err);
                 } else {
                    symbols.push(row.symbolid);
                 }
             });
        });
    
        db.close((err) => {
            if (err) { reject(err)} 
            else { resolve(symbols) };
        });
    
    });

}



/// Open file db and return. Possible error will be throwed ny sqllite
function getDB() {
    return new sqlite3.Database('./symbol.db');
}

// Promises to remove symbol
function removeSymbol(symbolid, callback) {

    return new Promise(function(resolve, reject) {

        var db = getDB();
    
    
        db.serialize(function () {
            db.run("CREATE TABLE IF NOT EXISTS symbol (symbolid TEXT, isactive INTEGER, description TEST)")
    
            var stmt = db.prepare("delete from symbol where symbolid = ? ");
            stmt.run(symbolid);
            stmt.finalize();
        });
    
        
        db.close((err) => {
            if (err) { reject(err)} 
            else { resolve() };
        });
    } );

    

}


function cleanData() {
    return new Promise(function(resolve, reject) {

        var db = getDB();
        
            db.serialize(function () {
                db.run("DROP TABLE symbol");
            });
            db.close(err => {
                if(err) { reject() } 
                else {resolve()} ;

            });
    })

    
}
module.exports.addSymbol = addSymbol;
module.exports.removeSymbol = removeSymbol;
module.exports.getSymbols = getSymbols;
module.exports.cleanData = cleanData;





