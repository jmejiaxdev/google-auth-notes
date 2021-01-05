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

router.get("/:id", async (req, res) => {
  try {
    const note = await noteSchema.findById(req.params.id).lean();
    res.render("notes/read", { note });
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const note = await noteSchema.findById(req.params.id).lean();
    res.render("notes/edit", { note });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    await noteSchema.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title, body: req.body.body });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await noteSchema.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
