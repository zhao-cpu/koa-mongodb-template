const dotenv = require("dotenv")
const Koa = require("koa");

const user = require("../routers/user")

dotenv.config();
const app = new Koa();

app.use(user.routes());

module.exports = app