const Router = require("@koa/router");

const UserModel = require("../model/UserModel");
const { setToken, checkPassword } = require("../utils/index");

const router = new Router();

router.get("/login", async (ctx) => {
	const { userName, password } = ctx.request.query;
	// 创建 Schema 时，password 字段设置了不显示，再次做判断
	const data = await UserModel.findOne({ userName }).select({ password: 1, userName: 1, avatar: 1 }).exec();
	if (!data)
		return (ctx.body = {
			code: 1,
			msg: "用户不存在",
		});

	const flag = checkPassword(password, data?.password);
	if (!flag)
		return (ctx.body = {
			code: 1,
			msg: "密码错误",
		});

	const token = setToken(data?._doc);
	delete data?._doc?.password;
	ctx.body = {
		code: 0,
		msg: "登录成功",
		data: {
			token,
			data,
		},
	};
});

module.exports = router;
