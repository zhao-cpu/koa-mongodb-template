## @koa/router 路由

下载

```js
npm install @koa/router
```

使用

```js
const Router = require("@koa/router");

const router = new Router();

// 设置路由前缀
// const router = new Router({ prefix: "/users" });

router.get("/", (ctx) => {
	ctx.body = {
		code: 0,
	};
});

app.use(router.routes());
```

## koa-body

获取 post 请求体参数
下载

```js
npm install koa-body
```

使用

```js
const { koaBody } = require("koa-body");

app.use(koaBody());
```
