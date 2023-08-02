const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	categories: {
		type: String,
	},
	desc: {
		type: String,
		required: true,
	},
	images: {
		type: String,
	},
	status: {
		type: String,
		// 1 审核中 2 通过 3 驳回
		default: "1",
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "user",
	},
});

const ArticleModel = mongoose.model("articles", Schema);

module.exports = ArticleModel;
