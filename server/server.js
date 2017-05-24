const data = require('./data');
const Koa = require('koa');
const router = require('koa-router')();
const bodyparser = require('koa-bodyparser');

const { todo } = data.create();

const port = 3111;
const server = new Koa();

server.use(bodyparser());

router.post('/add', (ctx, next) => {
  const { task } = ctx.request.body;

  todo.add(task);

  ctx.body = { result: 'success' };
});

router.get('/get/:taskId', async (ctx, next) => {
  const { taskId } = ctx.params;

  await todo.get(taskId)
    .then(res => {
      ctx.body = res;
    });
});

router.get('/list', async (ctx, next) => {
  await todo.list()
    .then(res => {
      ctx.body = res;
    })
});

server
  .use(router.routes())
  .use(router.allowedMethods());

console.log('listening on port', port);
server.listen(port);
