const { checkToken } = require("../utils");

function main(app, port) {
	const { createServer } = require("http");
	const { Server } = require("socket.io");

	const httpServer = createServer(app.callback());

	const io = new Server(httpServer, {
		/* options */
	});

	// 连接
	io.on("connection", (socket) => {
		// 获取 token
		const token = socket.handshake.query?.token;
		// 解析用户信息
		const userInfo = checkToken(token);
		if (userInfo) {
			// 向 socket 添加 userInfo 属性
			socket.userInfo = userInfo;
			// 自定义事件名 user，参数可直接传 json 格式
			socket.emit("user", { data: userInfo, msg: "获取信息成功" });
		} else {
			socket.emit("error", { data: null, msg: "token 错误" });
		}

		// 获取列表 data 前端传递的参数
		socket.on("list", (data) => {
			const list = Array.from(io.sockets.sockets).map((item) => item[1].userInfo);
			console.log("list", list);
		});

		// 获取私聊
		socket.on("single", (data) => {
			console.log("single", data);
			Array.from(io.sockets.sockets).forEach((item) => {
				if (item[1].userInfo?._id === data.id) {
					item[1].emit("single", {});
				}
			});
		});

		// 获取群聊
		socket.on("group", (data) => {
			console.log("group", data);
			// 给所有人发
			io.sockets.emit("group", {});

			// 发送除了自己，其他所有
			// socket.broadcast.emit("group", {});
		});

		socket.on("disconnect", (data) => {
			console.log("disconnect", data);
		});
	});

	httpServer.listen(port, () => {
		console.log(`http://127.0.0.1:${port}`);
	});
}

function sendAll(io) {
	const list = Array.from(io.sockets.sockets).map((item) => item[1].userInfo);
	// 群发
	io.sockets.emit("list", { data: list });
}

module.exports = main;
