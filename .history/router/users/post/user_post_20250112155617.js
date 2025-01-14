const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../../../model/usersModel");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
// post user for register
router.post("/log", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("email and password are required");
    }
    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    // decoding the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }
    const token = jwt.sign({ email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(201).json({
      status: "success",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
});
// get user for register
router.post("/reg", async (req, res) => {
  try {
    const { email, password, info } = req.body;
    if (!email || !password || !info) {
      return res.status(400).json({
        message: "email, password, info are required",
        status: "success",
      });
    }
    const existingUser = await userModel.findOne({
      email: email,
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists", status: "failed" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter and one lowercase letter",
        status: "failed",
      });
    }
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      info: info,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error post reg user");
  }
});
// get info user by email
router.post("/info", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const { avatar, info } = user;
    res.status(200).json({ status: "success", avatar, info });
  } catch (error) {
    console.error("Error fetching avatar:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/changepass", async (req, res) => {
  try 
    const { token } = req.body;
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    if (!payload) {
      return res.status(404).json({ error: "token incorrect" });
    }
    const user = await userModel.findOne({ email: payload.email });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
  } catch (error) {
    console.error("Error f:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
