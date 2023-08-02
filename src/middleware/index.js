const { checkToken } = require("../utils/index");

const auth = async (ctx, next) => {
	try {
		const { authorization } = ctx.request.header;
		const token = authorization.replace("Bearer ", "");
		const userInfo = checkToken(token);
		ctx.state.userInfo = userInfo;
		await next();
	} catch (error) {
		console.log("auth error", error);
		let message = "验证失败";
		switch (error.name) {
			case "TokenExpiredError":
				message = "token 过期";
				break;
			default:
				message = "token 错误";
				break;
		}

		ctx.body = {
			code: 401,
			message,
		};
	}
};

module.exports = { auth };
