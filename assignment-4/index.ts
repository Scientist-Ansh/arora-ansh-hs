// Requiring Modules
import express from 'express';
const mongoose = require('mongoose');
var expressLayouts = require('express-ejs-layouts');

const app = express();
import UserDetails from './models/userDetails';

const passport = require('passport');
const session = require('express-session');
const routes = require('./routes/router');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up view engine and layout
app.use(expressLayouts);
app.set('layout', './layout/main');
app.set('view engine', 'ejs');

// Set up session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use((UserDetails as any).createStrategy());
passport.serializeUser((UserDetails as any).serializeUser());
passport.deserializeUser((UserDetails as any).deserializeUser());

app.use(routes);

// Set up Express server
const server = app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});

// to run the tests please export the following:
module.exports = app;
