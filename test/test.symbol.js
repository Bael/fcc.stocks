const symbolsProvider = require("../server/providers/symbol");
var expect = require('expect.js');


beforeEach(async function() {
    await symbolsProvider.cleanData();
    
  });

  
describe('#crud()', function() {
    it('should add some', async function() {
        var id = await symbolsProvider.addSymbol("FB");
        expect(id != null).to.equal(true);
    });
  });
  



