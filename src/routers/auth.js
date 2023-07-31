const Router = require("@koa/router");
const UserModel = require("../model/UserModel");
const { setToken } = require("../utils/index");

const router = new Router();

router.get("/login", async (ctx) => {
	const { userName, password } = ctx.request.query;
	const data = await UserModel.findOne({ userName, password });
	const token = setToken(data?._doc);
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
