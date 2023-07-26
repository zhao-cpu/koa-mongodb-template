require("dotenv").config();
const path = require("node:path");

const Koa = require("koa");
const { koaBody } = require("koa-body");
const static = require("koa-static");
const views = require("koa-views");
const error = require("koa-json-error");

require("../db");
const user = require("../routers/user");

const app = new Koa();
app.use(error());
app.use(views(path.join(__dirname, "../views"), { map: { html: "ejs" } }));
app.use(static(path.join(__dirname, "../public")));
app.use(koaBody());
app.use(user.routes());

module.exports = app;
