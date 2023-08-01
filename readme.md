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

## formidable 文件上传

下载

```js
npm install formidable@v2
```

使用

```js
const path = require("node:path");
const formidable = require("formidable");

router.post("/", async (ctx, next) => {
	const form = formidable({
		multiples: true,
		// 设置上传文件的保存目录
		uploadDir: path.join(__dirname, "../public/uploads"),
		// 保存文件后缀
		keepExtensions: true,
		// 修改文件名 必须返回一个字符串即：新的存储文件名称
		filename: (name, ext, part, form) => {
			return `ttttt${ext}`;
		},
	});

	await new Promise((resolve, reject) => {
		form.parse(ctx.req, (err, fields, files) => {
			if (err) return reject(err);
			// files.file file就是前端上传的字段名称
			ctx.body = { fields, files: files.file };
			resolve();
		});
	});

	return await next();
});
```

## jsonwebtoken

下载

```js
npm install jsonwebtoken
```

生成 token

```js
const jwt = require("jsonwebtoken");
const token = jwt.sign(payload, JWTSECRET, { expiresIn: 60 * 60 * 24 });
```

验证 token

```js
jwt.verify(token, JWTSECRET);
```

### 报错 Expected \"payload\" to be a plain object.(翻译结果为：“payload”应为纯对象。)

返回的不是纯对象 == `res._doc`

```js
const res = await UserModel.create(body);
const token = jwt.sign(res._doc, JWTSECRET, { expiresIn: 60 * 60 * 24 });
```

## bcryptjs

下载

```js
npm install bcryptjs
```

使用

```js
/**
 * 加密
 * @param {*} val
 * @returns
 */
const crpytPassword = (val) => {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(val, salt);
	return hash;
};

/**
 * 解密验证
 * @param {*} val 原始值
 * @param {*} hash 加密后的值
 * @returns
 */
const checkPassword = (val, hash) => {
	return bcrypt.compareSync(val, hash);
};
```

## pm2 负载均衡

下载

```js
npm install pm2@latest -g
```

查看版本

```js
pm2 - v;
```

启动

```js
pm2 start app.js

// --watch 监听
pm2 start app.js --watch

// --name 别名
pm2 start app.js --name test
```

重载(不关闭)和重启(瞬间关闭开启)

```js
pm2 reload app.js
pm2 reload all

pm2 restart app.js
pm2 restart all
```

从 pm2 中关闭

```js

pm2 stop id值

// 例
pm2 stop 0
pm2 stop all
```

从 pm2 中移除

```js
pm2 delete 0
pm2 delete all
```

查看 pm2 所有项目列表

```js
pm2 list
```

查看详情

```js
pm2 show name的值

// 例
pm2 show app
```

实时监控查看资源

```js
pm2 monit
```

查看日志

```js
pm2 logs


pm2 logs app
```

### mode

-   fork
    只启动一个进程单实例，用于多语言混编 python php

-   cluster
    多实例多进程,只适用 node 一种语言,不需要额外端口配置

生成配置文件

```js
pm2 init simple


// 运行
pm2 start .\ecosystem.config.js
```
