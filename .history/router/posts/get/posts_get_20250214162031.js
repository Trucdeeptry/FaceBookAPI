const express = require("express");
const mongoose = require("mongoose");
const viewedpostsModel = require("../../../model/viewedpostsModel");
const postsModel = require("../../../model/postsModel");

const router = express.Router();
// Get posts haven't viewed by 1 user


module.exports = router