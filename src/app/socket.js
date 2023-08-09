const WebSocket = require("ws");

const { checkToken } = require("../utils");

const WebSocketServer = WebSocket.WebSocketServer;
const wss = new WebSocketServer({ port: 8080 });

/**
 * 发送消息封装
 * @param {*} type 1 获取用户列表 2 群发 3 私发
 * @param {*} data 返回的数据
 * @returns
 */
function sendMessage({ type, data, userInfo }) {
	return JSON.stringify({
		type,
		data,
		userInfo,
	});
}

/**
 * 获取用户列表
 */
function getUserList() {
	// wss.clients 是 Set 类型，
	const userList = Array.from(wss.clients).map((item) => item.userInfo);
	// 广播发送给全部客户端
	wss.clients.forEach(function each(client) {
		// 判断是否在线，发送给在线的客户端
		if (client.readyState === WebSocket.OPEN) {
			// 不使用二进制数据
			client.send(sendMessage({ type: 1, data: userList }), { binary: false });
		}
	});
}

wss.on("connection", function connection(ws, req) {
	try {
		// 获取 token
		const token = new URL(req.url, "http://localhost:3000").searchParams.get("token");
		// 解析 用户信息
		const userInfo = checkToken(token);

		if (userInfo) {
			// 向 ws 添加 userInfo 属性，值为 userInfo，可通过 wss.clients 查看
			ws.userInfo = userInfo;

			// 有用户连接时获取用户列表
			getUserList();
		} else {
			return ws.send(sendMessage({ type: 1, data: "token 过期" }));
		}

		// 监听客户端发来的消息, 客户端的消息都使用 JSON.stringify()
		ws.on("message", function message(data) {
			const msg = JSON.parse(data.toString());
			console.log("服务端接收客户端的消息", msg);

			if (msg?.type === 2) {
				//  2 群发
				wss.clients.forEach(function each(client) {
					// 判断是否自己，判断是否在线，发送给在线的客户端
					if (client !== ws && client.readyState === WebSocket.OPEN) {
						// 不使用二进制数据
						client.send(sendMessage({ type: 2, data: msg?.data }), { binary: false });
					}
				});
			} else if (msg?.type === 3) {
				// 3 私发
				wss.clients.forEach(function each(client) {
					// 发送给指定用户，判断是否在线
					if (client.userInfo._id == msg.userId && client.readyState === WebSocket.OPEN) {
						// 不使用二进制数据
						client.send(sendMessage({ type: 3, data: msg?.data }), { binary: false });
					}
				});
			}
		});

		ws.on("close", () => {
			console.log("close");
			// 有用户断开连接时，重新获取列表
			getUserList();
		});

		ws.on("error", (error) => {
			console.log("error", error);
		});
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			ws.send(sendMessage({ type: 1, data: "token 过期" }));
		}
	}
});
