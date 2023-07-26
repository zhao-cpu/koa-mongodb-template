const Router = require("@koa/router");
const formidable = require("formidable");
const path = require("node:path");

const router = new Router();

router.post("/upload", async (ctx, next) => {

	await new Promise((resolve, reject) => {
		const form = formidable({
			multiples: true,
			// 设置上传文件的保存目录
			uploadDir: path.join(__dirname, "../public/images"),
			// 保存文件后缀
			keepExtensions: true,
		});
		form.parse(ctx.req, (err, fields, files) => {
			if (err) {
				return (ctx.body = {
					code: 1,
					err,
				});
			}
			ctx.body = { fields, files };
			resolve();
		});
	});

	await next();
});

module.exports = router;
