import express from 'express';
import { ensureAuth } from '../middleware/auth';
import { noteModel } from '../models/note';

const notes = express.Router();

notes.get('/add', ensureAuth, (req, res) => {
  res.render('notes/add');
});

notes.post('/add', ensureAuth, async (req, res) => {
  try {
    // req.body.user = req?.user?._id;
    req.body.user = req?.user?.id;
    await noteModel.create(req.body);
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

notes.get('/:id', async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id).lean();
    res.render('notes/read', { note });
  } catch (error) {
    console.log(error);
  }
});

notes.get('/edit/:id', async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id).lean();
    res.render('notes/edit', { note });
  } catch (error) {
    console.log(error);
  }
});

notes.put('/:id', async (req, res) => {
  try {
    await noteModel.findOneAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body }
    );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

notes.delete('/delete/:id', async (req, res) => {
  try {
    await noteModel.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

export default notes;
