import express, { Request, Response } from 'express';
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');
const md = require('markdown-it')();

import UserDetails, { IUserDetails } from '../models/userDetails';
import Notes, { INote } from '../models/Notes';

export interface IRequest extends Request {
  user?: IUserDetails;
  logout?: () => void;
}

// api routes
router.get(
  '/api/notes',
  connectEnsureLogin.ensureLoggedIn(),
  (req: Request, res) => {
    Notes.find({}, (err: Error, notes: INote[]) => {
      if (err) {
        res.send(err);
      }
      res.json(notes);
    });
  }
);

router.get(
  '/api/notes/:id',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => {
    Notes.findById(req.params.id, (err: Error, note: INote) => {
      if (err) {
        res.send(err);
      }
      res.json(note);
    });
  }
);

router.post(
  '/api/notes',
  connectEnsureLogin.ensureLoggedIn(),
  (req: IRequest, res) => {
    const note = new Notes();
    note.title = req.body.title;
    note.createdBy = req.user?.username;
    note.status = req.body.status;
    note.data = req.body.data;
    note.save((err) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Note created!' });
    });
  }
);

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

router.get(
  '/updateNote/:id',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => {
    Notes.findById(req.params.id, (err: Error, note: INote) => {
      if (err) {
        res.send(err);
      }
      res.render('updateNote', { title: 'Update Note', note });
    });
  }
);

router.get('/logout', (req: IRequest, res) => {
  req.logout && req.logout();
  res.redirect('/');
});

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Signup' });
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  (UserDetails as any).register(
    new UserDetails({ username }),
    password,
    (err: Error, user: IUserDetails) => {
      if (err) {
        console.log(err);
        return res.render('signup', { title: 'Signup' });
      }
      passport.authenticate('local')(req, res, () => {
        res.redirect('/dashboard');
      });
    }
  );
});

// POST Routes
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/dashboard',
  }),
  (req: IRequest, res) => {
    console.log(req.user);
  }
);

// api routes
router.get(
  '/notes',
  connectEnsureLogin.ensureLoggedIn(),
  (req: IRequest, res) => {
    // if user is logged in, get the logged in user

    UserDetails.findOne(
      { username: req.user?.username },
      (err: Error, user: IUserDetails) => {
        if (err) {
          console.log(err);
        } else {
          Notes.find(
            { createdBy: user.username },
            (err: Error, notes: INote[]) => {
              if (err) {
                console.log(err);
              } else {
                res.render('notes', { notes, title: 'Notes' });
              }
            }
          );
        }
      }
    );
  }
);

router.post(
  '/notes',
  connectEnsureLogin.ensureLoggedIn(),
  (req: IRequest, res) => {
    // if user is logged in, get the logged in user

    UserDetails.findOne(
      { username: req.user?.username },
      (err: Error, user: IUserDetails) => {
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
      }
    );
  }
);

router.get(
  '/notes/:id',
  connectEnsureLogin.ensureLoggedIn(),
  (req: IRequest, res) => {
    // if user is logged in, get the logged in user

    UserDetails.findOne(
      { username: req.user?.username },
      (err: Error, user: IUserDetails) => {
        if (err) {
          console.log(err);
        } else {
          Notes.findById(req.params.id, (err: Error, note: INote) => {
            if (err) {
              console.log(err);
            } else {
              if (
                note.status === 'private' &&
                note.createdBy !== user.username
              ) {
                res.send('You are not authorized to view this note');
              } else {
                console.log('note is: ', note);
                let result = md.render(note.data);
                res.render('viewNote', { note, title: 'View Note', result });
              }
            }
          });
        }
      }
    );
  }
);

router.delete(
  '/notes/:id',
  connectEnsureLogin.ensureLoggedIn(),
  (req: IRequest, res) => {
    // if user is logged in, get the logged in user

    UserDetails.findOne(
      { username: req.user?.username },
      (err: Error, user: IUserDetails) => {
        if (err) {
          console.log(err);
        } else {
          Notes.findById(req.params.id, (err: Error, note: INote) => {
            if (err) {
              console.log(err);
            } else {
              if (note.createdBy !== user.username) {
                res.send('You are not authorized to delete this note');
              } else {
                Notes.findByIdAndDelete(
                  req.params.id,
                  (err: Error, note: INote) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.send('Note deleted successfully');
                    }
                  }
                );
              }
            }
          });
        }
      }
    );
  }
);

router.post(
  '/notes/:id',
  connectEnsureLogin.ensureLoggedIn(),
  (req: IRequest, res) => {
    // if user is logged in, get the logged in user

    UserDetails.findOne(
      { username: req.user?.username },
      (err: Error, user: IUserDetails) => {
        if (err) {
          console.log(err);
        } else {
          Notes.findById(req.params.id, (err: Error, note: INote) => {
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
      }
    );
  }
);

module.exports = router;
