const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
	},
	{
		timestamps: true,
	}
);

const UserModel = mongoose.model("users", Schema);

module.exports = UserModel;
