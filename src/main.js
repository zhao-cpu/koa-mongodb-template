const app = require("./app");
require("./app/socket");

const { N_PORT } = process.env;

app.listen(N_PORT, () => {
	console.log(`http://127.0.0.1:${N_PORT}`);
});
