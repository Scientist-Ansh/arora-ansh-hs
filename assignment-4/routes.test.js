const request = require('supercharge');
const app = require('./index.js');

describe('Test the notes api', () => {
  it('should return a list of notes', (done) => {
    request(app)
      .get('/notes')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  }).timeout(5000);

  it('should return a single note', (done) => {
    request(app)
      .get('/notes/1')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  }).timeout(5000);

  it('should create a new note', (done) => {
    request(app)
      .post('/notes')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  }).timeout(5000);

  it('should update a note', (done) => {
    request(app)
      .put('/notes/1')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  }).timeout(5000);
});
