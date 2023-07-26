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

## koa-static

配置静态资源

下载

```js
npm install koa-static
```

使用

```js
const path = require("node:path");
const static = require("koa-static");

app.use(static(path.join(__dirname, "../public")));
// http://127.0.0.1:3000/images/test.jpg
```

## npm install koa-views ejs

引入模板文件
下载

```js
npm install koa-views ejs
```

使用

```js
const views = require("koa-views");
// 此时文件后缀为  .ejs
// app.use(views(path.join(__dirname, "../views"), { extension: "ejs" }));
// 把文件后缀替换为 .html
app.use(views(path.join(__dirname, "../views"), { map: { html: "ejs" } }));

router.get("/", async (ctx) => {
	let title = "你好ejs";
	let list = ["哈哈", "嘻嘻", "看看", "问问"];
	let content = "<h2>这是一个h2</h2>";
	let num = 10;
	await ctx.render("index", {
		title,
		list,
		content,
		num,
	});
});
```

模板

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>普通模版</h1>
    <h1>ejs循环输出模版</h1>
    <ul>
        <%for(var i=0;i<list.length;i++){%>
            <li>
                <%= list[i] %>
            </li>
        <%}%>
    </ul>
    <h2>原文输出标签</h2>
    <%- content %>
        <h2>条件判断</h2>
        <% if(num> 20){ %>
            大于20
        <% }else{ %>
            小于20
        <% }
    %>
</body>

</html>
```
