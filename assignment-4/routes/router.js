const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');

// GET Routes
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) =>
  res.render('dashboard', { title: 'Dashboard' })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// POST Routes
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/dashboard',
  }),
  (req, res) => {
    console.log(req.user);
  }
);

// api routes
router.get('/notes', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('returns all the notes for the logged in user');
});

router.get('/notes/:noteId', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('returns a single note');
});

router.post('/notes', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('creates a new note');
});

router.put('/notes/:noteId', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('updates a note');
});

router.delete('/notes/:noteId', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('deletes a note');
});

module.exports = router;
