const Schema = require("async-validator");

const ArticleModel = require("../model/ArticleModel");

class ArticleController {
	async create(ctx) {
		const { body } = ctx.request;
		const data = await ArticleModel.create({
			...body,
			user: ctx.state.userInfo?._id,
		});
		ctx.body = {
			code: 0,
			msg: "创建成功",
			data,
		};
	}

	async findAll(ctx) {
		const data = await ArticleModel.find();
		ctx.body = {
			code: 0,
			msg: "查询成功",
			data,
		};
	}

	async findOne(ctx) {
		const { id } = ctx.params;
		const data = await ArticleModel.findById(id)
			.populate({
				path: "user",
				model: "user",
			})
			.exec();
		ctx.body = {
			code: 0,
			msg: "查询成功",
			data,
		};
	}
}

module.exports = new ArticleController();
