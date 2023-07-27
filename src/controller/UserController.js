const UserModel = require("../model/UserModel");
class UserController {
	async create(ctx) {
		const { body } = ctx.request;
		const data = await UserModel.create(body);
		ctx.body = {
			code: 0,
			msg: "创建成功",
			data,
		};
	}

	async findAll(ctx) {
		const data = await UserModel.find();
		ctx.body = {
			code: 0,
			msg: "查询成功",
			data,
		};
	}

	async findOne(ctx) {
		const { id } = ctx.params;
		const data = await UserModel.findById(id);
		ctx.body = {
			code: 0,
			msg: "查询成功",
			data,
		};
	}

	async remove(ctx) {
		const { id } = ctx.params;
		const data = await UserModel.deleteOne({ _id: id });
		ctx.body = {
			code: 0,
			msg: "删除成功",
			data,
		};
	}

	async update(ctx) {
		const { id } = ctx.params;
		const { body } = ctx.request;
		const data = await UserModel.updateOne({ _id: id }, body);
		ctx.body = {
			code: 0,
			msg: "更新成功",
			data,
		};
	}
}

module.exports = new UserController();
