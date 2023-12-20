const path = require("node:path");

const Router = require("@koa/router");
const dayjs = require("dayjs");
const formidable = require("formidable");
const send = require("koa-send");
// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs");

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

router.get("/captcha", async (ctx) => {
	const CaptchaClient = tencentcloud.captcha.v20190722.Client;

	// 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
	// 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
	// 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
	const clientConfig = {
		credential: {
			secretId: "111",
			secretKey: "111",
		},
		// 产品地域
		region: "",
		// 可选配置实例
		profile: {
			httpProfile: {
				endpoint: "captcha.tencentcloudapi.com",
			},
		},
	};

	// 实例化要请求产品的client对象,clientProfile是可选的
	const client = new CaptchaClient(clientConfig);
	const params = {
		// 固定填值：9。可在控制台配置不同验证码类型。
		CaptchaType: 9,
		// 前端回调函数返回的用户验证票据
		Ticket: "tr03oA3-SxBeA7Kt2-4guGlSFusqTtWUTJxCFBTZTPPsB1jW7WdYnJ5nPLLfWhKZM7psEy8cDq0aVyJzw4TkT-4-R9udbuIRK67zRjYBumMydfGJk2XAgrsgbXA6asRJ5r-nWNVcaR-CeFnbGuev0ZzQ3JI3OYhHT9XdJ5UPQbLlkqPgCK3IpEeuaYKEsLuRFsJmyLwup1kBvo0*",
		// 业务侧获取到的验证码使用者的外网IP
		UserIp: "223.252.222.38",
		// 前端回调函数返回的随机字符串
		Randstr: "@vhO",
		// 验证码应用ID。登录 验证码控制台，在验证列表的【密钥】列，即可查看到CaptchaAppId。
		CaptchaAppId: 111,
		// 验证码应用密钥。登录 验证码控制台，在验证列表的【密钥】列，即可查看到AppSecretKey。AppSecretKey属于服务器端校验验证码票据的密钥，请妥善保密，请勿泄露给第三方。
		AppSecretKey: "111",
	};
	try {
		const data = await client.DescribeCaptchaResult(params);
		console.log("captcha", data);
		ctx.body = {
			code: 0,
			msg: "验证成功",
			data,
		};
	} catch (error) {
		console.error("error", error);
		ctx.body = {
			code: 1,
			msg: "验证失败",
			data: error,
		};
	}
});

module.exports = router;
