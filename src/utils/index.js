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
 * 刷新 token
 * @param {*} token
 * @param {*} expiresIn 过期时间
 * @param {*} secretOrPrivateKey 秘钥
 * @param {*} verifyOptions 配置
 * @param {*} callback
 * @returns
 */
const refreshToken = (token, expiresIn, secretOrPrivateKey, verifyOptions, callback) => {
	//TODO: check if token is not good, if so return error ie: no payload, not required fields, etc.

	var done;
	if (callback) {
		done = function () {
			var args = Array.prototype.slice.call(arguments, 0);
			return process.nextTick(function () {
				callback.apply(null, args);
			});
		};
	} else {
		done = function (err, data) {
			if (err) {
				console.log("err : " + err);
				throw err;
			}
			return data;
		};
	}

	var verified;
	var header;
	var payload;
	var decoded = jwt.decode(token, { complete: true });

	try {
		verified = jwt.verify(token, secretOrPrivateKey, verifyOptions);
	} catch (error) {
		verified = null;
	}

	if (verified) {
		if (decoded.header) {
			header = decoded["header"];
			payload = decoded["payload"];
		} else {
			payload = token;
		}

		var optionMapping = {
			exp: "expiresIn",
			aud: "audience",
			nbf: "notBefore",
			iss: "issuer",
			sub: "subject",
			jti: "jwtid",
			alg: "algorithm",
		};
		var newToken;
		var obj = {};
		var options = {};

		for (var key in payload) {
			if (Object.keys(optionMapping).indexOf(key) === -1) {
				obj[key] = payload[key];
			} else {
				options[optionMapping[key]] = payload[key];
			}
		}

		if (header) {
			options.header = {};
			for (var key in header) {
				if (key !== "typ") {
					//don't care about typ -> always JWT
					if (Object.keys(optionMapping).indexOf(key) === -1) {
						options.header[key] = header[key];
					} else {
						options[optionMapping[key]] = header[key];
					}
				}
			}
		} else {
			console.log("No algorithm was defined for token refresh - using default");
		}

		if (!token.iat) {
			options["noTimestamp"] = true;
		}

		options["expiresIn"] = expiresIn;

		newToken = jwt.sign(obj, secretOrPrivateKey, options);
		return done(null, newToken);
	} else {
		return done("Token invalid.  Failed to verify.");
	}
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
	refreshToken,
	checkToken,
	crpytPassword,
	checkPassword,
};
