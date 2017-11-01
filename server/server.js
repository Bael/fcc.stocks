const Koa = require('koa');
const app = new Koa();
require('dotenv').config();
const serve = require('koa-static');
const port = process.env.PORT || 3000;
const path = require('path');
const {routes, allowedMethods} = require('./routes/stocks');
const stocksProvider = require('./providers/stocks');
var http = require('http').createServer(app.callback());
var io = require('socket.io')(http);

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


  io.on('connection', async function(socket){
    console.log('a user connected');
    socket.on('addSymbol', async function(msg){
        console.log('add symbol called for '+msg);
        let response = await stocksProvider.getStocksBySymbol(msg);
        io.emit('symbolAdded', response);
      });
  });

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

  http.listen(port, function(){
    console.log('listening on *:'+port);
  });
  //app.listen(port);