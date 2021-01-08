import express from "express";
import { User } from "models/user";
import { ensureGuest, ensureAuth } from "../middleware/auth";
import { noteModel } from "../models/note";

const index = express.Router();

index.get("/", ensureGuest, (req, res) => {
  res.render("login", { layout: "login" });
});

index.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const user = req?.user as User;
    const notes = await noteModel.find({ user: user.id }).lean();
    res.render("dashboard", { name: user.firstName, notes, imgSrc: user.image });
  } catch (error) {
    console.log(error);
  }
});

export default index;
