const express = require('express');
const userRouter = require('./user.route.js')
const accountRouter = require("./account.route.js");
const router = express.Router();

router.use("/user" , userRouter);
router.use("/account", accountRouter);
module.exports = router;