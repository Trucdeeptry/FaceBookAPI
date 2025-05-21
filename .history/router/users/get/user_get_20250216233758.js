const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../../../model/usersModel");
const router = express.Router();

// get user profile by id
router.post("/profile", async (req, res) => {
    try {
      const { id } = req.body;
      const user = await userModel.findOne({ id });
  
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      const { avatar, info, bio,  } = user;
      res.status(200).json({ status: "success", avatar, info });
    } catch (error) {
      console.error("Error fetching avatar:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
