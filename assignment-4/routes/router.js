const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');

const UserDetails = require('../models/userDetails');
const Notes = require('../models/Notes');

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

router.get('/addNote', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.render('addNote', { title: 'Add Note' });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Signup' });
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  UserDetails.register(new UserDetails({ username }), password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('signup', { title: 'Signup' });
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/dashboard');
    });
  });
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
router.get('/notes', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  // if user is logged in, get the logged in user

  UserDetails.findOne({ username: req.user.username }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      Notes.find({ createdBy: user.username }, (err, notes) => {
        if (err) {
          console.log(err);
        } else {
          res.render('notes', { notes, title: 'Notes' });
        }
      });
    }
  });
});

router.post('/notes', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  // if user is logged in, get the logged in user

  UserDetails.findOne({ username: req.user.username }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      const { data, status, title } = req.body;
      console.log(data, status, title);
      const newNote = new Notes({
        createdBy: user.username,
        data,
        status,
        title,
      });
      newNote.save((err, note) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/notes');
        }
      });
    }
  });
});

router.get('/notes/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  // if user is logged in, get the logged in user

  UserDetails.findOne({ username: req.user.username }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      Notes.findById(req.params.id, (err, note) => {
        if (err) {
          console.log(err);
        } else {
          if (note.status === 'private' && note.createdBy !== user.username) {
            res.send('You are not authorized to view this note');
          } else {
            console.log('note is: ', note);
            console.log(note);
            res.render('updateNote', { note, title: 'Update Note' });
          }
        }
      });
    }
  });
});

router.delete('/notes/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  // if user is logged in, get the logged in user

  UserDetails.findOne({ username: req.user.username }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      Notes.findById(req.params.id, (err, note) => {
        if (err) {
          console.log(err);
        } else {
          if (note.createdBy !== user.username) {
            res.send('You are not authorized to delete this note');
          } else {
            Notes.findByIdAndDelete(req.params.id, (err, note) => {
              if (err) {
                console.log(err);
              } else {
                res.send('Note deleted successfully');
              }
            });
          }
        }
      });
    }
  });
});

router.post('/notes/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  // if user is logged in, get the logged in user

  UserDetails.findOne({ username: req.user.username }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      Notes.findById(req.params.id, (err, note) => {
        if (err) {
          console.log(err);
        } else {
          if (note.createdBy !== user.username) {
            res.send('You are not authorized to edit this note');
          } else {
            const { data, status, title } = req.body;
            console.log(data, status);
            Notes.findByIdAndUpdate(
              req.params.id,
              {
                data,
                status,
                title,
              },
              (err, note) => {
                if (err) {
                  console.log(err);
                } else {
                  res.redirect('/notes/' + req.params.id);
                }
              }
            );
          }
        }
      });
    }
  });
});

module.exports = router;
