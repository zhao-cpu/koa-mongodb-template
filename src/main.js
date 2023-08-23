const app = require("./app");
const { N_PORT } = process.env;

// ws
// require("./app/socket");

// socket.io
const main = require("./app/socket.io");
main(app, N_PORT);
