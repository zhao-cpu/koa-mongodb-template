const path = require("node:path");

require("dotenv").config();
const Koa = require("koa");
const { koaBody } = require("koa-body");
const static = require("koa-static");
const views = require("koa-views");
const error = require("koa-json-error");
const cors = require("@koa/cors");

// require("../db");
const router = require("../routers/index");

const app = new Koa();

app.use(cors());
app.use(error());
app.use(views(path.join(__dirname, "../views"), { map: { html: "ejs" } }));
app.use(static(path.join(__dirname, "../public")));
app.use(koaBody());
app.use(router.routes());

module.exports = app;
