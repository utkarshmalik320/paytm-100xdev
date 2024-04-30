const express = require("express");
const zod = require("zod");
const { User, Account } = require("../database/database");
const JWT_SECRET = require("../config");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {authMiddleware} = require("../middlewares/middleware");

// Signup schema definition
const signupSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

// Signup route
router.post("/signup", async (req, res) => {
  const { success, data } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect input format",
    });
  }

  const existingUser = await User.findOne({
    username: data.username,
  });

  if (existingUser) {
    return res.status(409).json({
      message: "Email already registered",
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    username: data.username,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
  });

  const userId = user._id;

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});

// Signin schema definition
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

// Signin route
router.post("/signin", async (req, res) => {
    const { success, data } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect input format"
        });
    }

    const user = await User.findOne({
        username: data.username,
    });

    if (user) {
        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign({
                userId: user._id
            }, JWT_SECRET);

            res.json({
                message:"Login Successfully",
                token: token
            });
            return;
        }
    }

    res.status(401).json({
        message: "Incorrect email or password"
    });
});

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/update", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;


module.exports = router;
