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
    const { email, password, info, type } = req.body;
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
        .json({ message: "This email already exists", status: "failed" });
    }
    if (type == "check") {
      res.status(200).json({
        status: "success",
        message: "User not exists",
      });
    }
    if (type == "reg") {
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
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error post reg user");
  }
});
// get info user by email or id
router.post("/info", async (req, res) => {
  try {
    let { identifiers } = req.body;

    if (!identifiers) {
      return res.status(400).json({ error: "Please provide identifiers" });
    }
    const results = [];
    // must declare it to array for get 1 user scenario
    if (typeof identifiers == "string") {
      identifiers = [identifiers];
    }
    // loop indentifier to get each user
    let user;
    for (const identifier of identifiers) {
      if (identifier.includes("@")) {
        user = await userModel.findOne({ email: identifier });
      } else {
        user = await userModel.findById(identifier);
      }
      results.push(user);
    }

    if (results.length == 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userList = results.map((result) => {
      return {
        _id: result._id,
        info: result.info,
        avatar: result.avatar,
        email: result.email,
      };
    });

    res.status(200).json(userList);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: `Internal Server Error` });
  }
});

router.post("/changepass", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error when changing password:", error);
    res
      .status(500)
      .json({ error: `Internal Server Error for changing password` });
  }
});
router.post("/friends-list", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const { friends } = user;
    return res.status(200).json({ status: "success", friends });
  } catch (error) {
    console.error("Error when get friends:", error);
    res.status(500).json({ error: `Internal Server Error for get friends` });
  }
});

router.post("/change-info", async (req, res) => {
  try {
    const { info, avatar, bio, email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Please provide email" });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        ...(info && { info }),
        ...(avatar && { avatar }),
        ...(bio !== undefined  && { bio }),
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User info updated successfully" });
  } catch (error) {
    console.error("Error when change info:", error);
    res.status(500).json({ error: `Internal Server Error for change info` });
  }
});
module.exports = router;
