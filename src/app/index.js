require("dotenv").config();
const Koa = require("koa");
const { koaBody } = require("koa-body");

require("../db")
const user = require("../routers/user");

const app = new Koa();

app.use(koaBody());
app.use(user.routes());

module.exports = app;
