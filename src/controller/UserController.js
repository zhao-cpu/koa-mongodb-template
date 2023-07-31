const Schema = require("async-validator");

const UserModel = require("../model/UserModel");
const { phoneRegular } = require("../utils/regular");
const { crpytPassword } = require("../utils/index");

class UserController {
	async create(ctx) {
		const { body } = ctx.request;

		const descriptor = {
			userName: {
				type: "string",
				required: true,
				message: "用户名必填",
			},
			password: {
				type: "string",
				required: true,
				message: "密码必填",
			},
			phone: [
				{
					type: "number",
					required: true,
					message: "手机号必填",
				},
				{
					validator: (rule, value) => {
						const flag = phoneRegular.test(value);
						return flag;
					},
					message: "请输入正确的手机号",
				},
			],
			sex: {
				type: "enum",
				enum: [0, 1, 2],
				required: true,
				message: "性别必填",
			},
		};

		const validator = new Schema.default(descriptor);
		await validator.validate(body);

		body.password = crpytPassword(body.password);

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
