const express = require("express");
const { ensureGuest, ensureAuth } = require("../middleware/auth");
const noteSchema = require("../models/note");

const router = express.Router();

router.get("/", ensureGuest, (req, res) => res.render("login", { layout: "login" }));

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const notes = await noteSchema.find({ user: req.user.id }).lean();
    res.render("dashboard", { name: req.user.firstName, notes, imgSrc: req.user.image });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
