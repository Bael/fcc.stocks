const Router = require('koa-router');

const convert = require('koa-convert');
const KoaBody = require('koa-body');
const stocksProvider = require('../providers/stocks');

const router = new Router({
    prefix: '/stocks'
})
const koaBody = convert(KoaBody());

router
  .get('/', async (ctx, next) => {
    let resp = await stocksProvider.getCurrentStocks();
    ctx.body = resp;
  })
  

module.exports.routes = () => { return router.routes() };
module.exports.allowedMethods = () => { return router.allowedMethods() };
