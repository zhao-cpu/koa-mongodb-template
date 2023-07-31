const mongoose = require("mongoose");

const { M_HOST, M_PORT, M_DB } = process.env;

mongoose
	.connect(`mongodb://${M_HOST}:${M_PORT}/${M_DB}`)
	.then(() => {
		console.log(`mongodb://${M_HOST}:${M_PORT}/${M_DB}`);
	})
	.catch((err) => {
		console.log(err);
	});
