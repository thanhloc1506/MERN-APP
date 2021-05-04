const { Router } = require("express");

const postsRouter = require("./posts");
const usersRouter = require("./users");

const router = Router({ mergeParams: true });

router.use("/posts", postsRouter);
router.use("/users", usersRouter);

module.exports = router;
