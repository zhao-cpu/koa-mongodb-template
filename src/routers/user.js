const Router = require("@koa/router");

const { create, findAll, findOne, remove, update } = require("../controller/UserController");
const { auth } = require("../middleware/index");

const router = new Router({ prefix: "/users" });

router.get("/", auth, findAll);

router.get("/:id", auth, findOne);

router.post("/", create);

router.delete("/:id", remove);

router.patch("/:id", update);

module.exports = router;
