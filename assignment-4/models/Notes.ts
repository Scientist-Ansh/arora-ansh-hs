import mongoose from 'mongoose';

// interface INote
export interface INote {
  title: string;
  data: string;
  status: string;
  createdBy: string;
}

const Note = new mongoose.Schema<INote>({
  title: String,
  createdBy: String,
  status: String,
  data: String,
});

export default mongoose.model('Note', Note);
