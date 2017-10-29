const Router = require('koa-router');

const convert = require('koa-convert');
const KoaBody = require('koa-body');

const router = new Router({
    prefix: '/stocks'
})
const koaBody = convert(KoaBody());

router
  .get('/', async (ctx, next) => {
      ctx.body = {"OK":100};
  })
  

module.exports.routes = () => { return router.routes() };
module.exports.allowedMethods = () => { return router.allowedMethods() };
