import express from 'express';
import { ensureGuest, ensureAuth } from '../middleware/auth';
import { noteModel } from '../models/note';

const index = express.Router();

index.get('/', ensureGuest, (req, res) => {
  res.render('login', { layout: 'login' });
});

index.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const notes = await noteModel.find({ user: req?.user?.id }).lean();
    res.render('dashboard', {
      name: req?.user?.firstName,
      notes,
      imgSrc: req?.user?.image,
    });
  } catch (error) {
    console.log(error);
  }
});

export default index;
