const fs = require("node:fs");

const Router = require("@koa/router");

// 全局前缀
const router = new Router({ prefix: "/api" });

fs.readdirSync(__dirname).forEach(async (file) => {
	if (file !== "index.js") {
		const r = await import("./" + file);
		router.use(r.default.routes());
	}
});

module.exports = router;
