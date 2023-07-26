require("dotenv").config();
const path = require("node:path");

const Koa = require("koa");
const { koaBody } = require("koa-body");
const static = require("koa-static");

require("../db");
const user = require("../routers/user");

const app = new Koa();

app.use(static(path.join(__dirname, "../public")));
app.use(koaBody());
app.use(user.routes());

module.exports = app;
