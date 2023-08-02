const Router = require("@koa/router");
const dayjs = require("dayjs");
const formidable = require("formidable");

const { mkdirTime } = require("../utils/index");
const { refreshToken } = require("../utils/index");
const { auth } = require("../middleware/index");

const { JWTSECRET } = process.env;

const router = new Router();

router.post("/upload", auth, async (ctx, next) => {
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

router.get("/refresh", auth, (ctx) => {
	const { authorization } = ctx.request.header;
	const token = authorization.replace("Bearer ", "");
	if (!token)
		ctx.body = {
			code: 1,
			msg: "token 不存在",
		};
	const newToken = refreshToken(token, 60 * 6, JWTSECRET);
	ctx.body = {
		code: 0,
		msg: "刷新成功",
		token: newToken,
	};
});
module.exports = router;
