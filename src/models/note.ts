import mongoose, { Schema, Document } from 'mongoose';

export interface Note {
  title: string;
  body: string;
  dateCreated: string;
  user: string;
}

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export const noteModel = mongoose.model<Note & Document>('Note', schema);
