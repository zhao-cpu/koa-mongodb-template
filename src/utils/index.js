const path = require("node:path");
const fs = require("node:fs");

/**
 * 创建上传图片路径
 * @param {string} time 当日时间：20230727
 * @returns 生成的文件路径
 */
const mkdirTime = (time) => {
	const dir = `${path.join(__dirname, "../public/uploads", time)}`;
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
	return dir;
};

module.exports = {
	mkdirTime,
};
