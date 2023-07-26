const Router = require("@koa/router");

const router = new Router({ prefix: "/users" });

router.get("/", (ctx) => {
	ctx.body = {
		code: 0,
	};
});

module.exports = router;
