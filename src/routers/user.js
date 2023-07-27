const Router = require("@koa/router");
const { create, findAll, findOne, remove, update } = require("../controller/UserController");

const router = new Router({ prefix: "/users" });

router.get("/", findAll);

router.get("/:id", findOne);

router.post("/", create);

router.delete("/:id", remove);

router.patch("/:id", update);

module.exports = router;
