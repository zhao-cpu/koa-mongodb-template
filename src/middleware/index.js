const test = async (ctx, next) => {
	await next();
};

module.exports = { test };
