const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
	{
		avatar: String,
		userName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		sex: {
			type: String,
			required: true,
			// 0 未知 1 男 2 女
			enum: [0, 1, 2],
			default: 0,
		},
		phone: String,
	},
	{
		timestamps: true,
	}
);

const UserModel = mongoose.model("user", Schema);

module.exports = UserModel;
