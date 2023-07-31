const path = require("node:path");
const fs = require("node:fs");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { JWTSECRET } = process.env;

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

/**
 * 设置 token
 * @param {*} payload
 * @returns
 */
const setToken = (payload) => {
	const token = jwt.sign(payload, JWTSECRET, { expiresIn: 60 * 60 * 24 });
	return token;
};

/**
 * 验证 token
 * @param {*} token
 * @returns
 */
const checkToken = (token) => {
	return jwt.verify(token, JWTSECRET);
};

/**
 * 加密
 * @param {*} val
 * @returns
 */
const crpytPassword = (val) => {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(val, salt);
	return hash;
};

/**
 * 解密验证
 * @param {*} val 原始值
 * @param {*} hash 加密后的值
 * @returns
 */
const checkPassword = (val, hash) => {
	return bcrypt.compareSync(val, hash);
};

module.exports = {
	mkdirTime,
	setToken,
	checkToken,
	crpytPassword,
	checkPassword,
};
