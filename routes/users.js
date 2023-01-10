const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const verify = require("../middleware/verify");
const { connection } = require("../connection");

router.post("/register", async (req, res) => {
  const { db } = await connection();
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ message: "Please fill all the details" });
  }

  const userExists = await db.collection("users").findOne({ email });

  if (userExists) {
    return res.json({ message: "User already exists", isSuccess: false });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .collection("users")
    .insertOne({ name, email, password: hashedPassword });

  return res.json({ message: "User Registered Successfully", isSuccess: true });
});

router.post("/login", async (req, res) => {
  const { db } = await connection();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ message: "Please fill all the details" });
  }

  const userExists = await db.collection("users").findOne({ email });

  if (!userExists) {
    return res.json({
      message: "User Does not exist. Please register first",
      isSuccess: false,
    });
  }

  //Comparing Passwords
  const passwordIsTrue = await bcrypt.compare(password, userExists?.password);

  //Generating Token
  const secretkey = "secretkey";
  const token = jwt.sign(
    { _id: userExists?._id, name: userExists?.name },
    secretkey
  );

  if (passwordIsTrue) {
    return res.json({
      message: "Login Successful",
      email,
      token,
      isSuccess: true,
    });
  } else {
    return res.json({ message: "Password Is Incorrect", isSuccess: false });
  }
});

module.exports = router;
