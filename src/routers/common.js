const path = require("node:path");

const Router = require("@koa/router");
const dayjs = require("dayjs");
const formidable = require("formidable");
const send = require("koa-send");

const { mkdirTime } = require("../utils/index");
const { refreshToken } = require("../utils/index");
const { auth } = require("../middleware/index");
const CityModel = require("../model/CityModel");

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

router.get("/downloads", async (ctx, next) => {
	const filePath = "/uploads/20230727/baca7d568e3cbbd1a0c360700.webp.jpg";
	ctx.attachment(filePath);
	await send(ctx, filePath, { root: path.join(__dirname, "../public") });
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

router.get("/city", async (ctx) => {
	const { level = "1", pcode = "0" } = ctx.request.query;
	const data = await CityModel.find({ level, pcode });
	ctx.body = {
		code: 0,
		msg: "获取成功",
		data,
	};
});

module.exports = router;
