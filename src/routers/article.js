const Router = require("@koa/router");

const { create, findAll, findOne } = require("../controller/ArticleController");
const { auth } = require("../middleware/index");

const router = new Router({ prefix: "/articles" });

router.get("/:id", findOne);

router.get("/", findAll);

router.post("/", auth, create);

module.exports = router;
