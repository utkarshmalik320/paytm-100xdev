const express = require('express');
const userRouter = require('./user.route.js')
const router = express.Router();

router.use("/user" , userRouter);

module.exports = router;