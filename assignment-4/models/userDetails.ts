import mongoose from 'mongoose';
const passportLocalMongoose = require('passport-local-mongoose');

export interface IUserDetails {
  username: string;
  password: string;
}
// Setting up the schema
const User = new mongoose.Schema<IUserDetails>({
  username: String,
  password: String,
});

// Setting up the passport plugin
User.plugin(passportLocalMongoose);

export default mongoose.model('User', User);
