// Write a web server `server`, which responds to any request after `100ms` and the server is non blocking.

const http = require('http');
const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  // print the body of the request in a non-blocking way
  let body = '';
  req
    .on('data', (chunk) => {
      body += chunk;
    })
    .on('end', () => {
      if (body) {
        console.log(body);
      }
    });
  setTimeout(() => {
    res.end('Hello World!');
  }, 100);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
