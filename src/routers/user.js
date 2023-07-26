const Router = require("@koa/router");

const router = new Router({ prefix: "/users" });

router.get("/", (ctx) => {
	ctx.body = {
		code: 0,
		data: ctx.query,
	};
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
