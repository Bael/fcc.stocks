const Koa = require('koa');
const app = new Koa();
require('dotenv').config();
const serve = require('koa-static');
const port = process.env.PORT || 3000;
const path = require('path');
const {routes, allowedMethods} = require('./routes/stocks');

//console.log(stocksRoute.stocksRoute());
app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // will only respond with JSON
      ctx.status = err.statusCode || err.status || 500;
      ctx.body = {
        message: err.message
      };
    }
  })


app.use(routes());
app.use(allowedMethods());
// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  });
  
  // logger
  
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
  });

  app.use(serve(path.join(__dirname,'../public')));
  // response
  
  app.use(async ctx => {
    ctx.body = 'Hello World!!!';
  });

  app.listen(port);