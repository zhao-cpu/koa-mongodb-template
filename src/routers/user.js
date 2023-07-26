const Router = require("@koa/router");

const router = new Router({ prefix: "/users" });

router.get("/", async(ctx) => {
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

	// ctx.body = {
	// 	code: 0,
	// 	data: ctx.query,
	// };
});

router.get("/:id", (ctx) => {
	ctx.body = {
		code: 0,
		data: ctx.params,
	};
});

router.post("/", (ctx) => {
	ctx.body = {
		code: 0,
		data: ctx.request.body,
	};
});

router.delete("/:id", (ctx) => {
	ctx.body = {
		code: 0,
		data: ctx.params,
	};
});

router.put("/", (ctx) => {
	ctx.body = {
		code: 0,
		data: ctx.request.body,
	};
});

module.exports = router;
