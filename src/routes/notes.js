const express = require("express");
const { ensureAuth } = require("../middleware/auth");
const noteSchema = require("../models/note");

const router = express.Router();

router.get("/add", ensureAuth, (req, res) => {
  res.render("notes/add");
});

router.post("/add", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user._id;
    await noteSchema.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;