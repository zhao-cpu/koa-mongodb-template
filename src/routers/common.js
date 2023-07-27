const path = require("node:path");

const Router = require("@koa/router");
const dayjs = require("dayjs");
const formidable = require("formidable");

const { mkdirTime } = require("../utils/index");

const router = new Router({ prefix: "/upload" });

router.post("/", async (ctx, next) => {
	const time = dayjs().format("YYYYMMDD");
	const dir = mkdirTime(time);

	const form = formidable({
		multiples: true,
		// 设置上传文件的保存目录
		uploadDir: dir,
		// 保存文件后缀
		keepExtensions: true,
	});
	await new Promise((resolve, reject) => {
		form.parse(ctx.req, (err, fields, files) => {
			if (err) return reject(err);
			ctx.body = {
				code: 0,
				msg: "上传成功",
				files: files.file,
				url: `${ctx.origin}/uploads/${time}/${files.file.newFilename}`,
			};
			resolve();
		});
	});

	return await next();
});

module.exports = router;
