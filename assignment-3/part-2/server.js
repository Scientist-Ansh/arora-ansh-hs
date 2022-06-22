#!/usr/bin/env node

// create a simple cli tool to benchmark a server using commander library
// following options can be used:
// - `-c[concurrency]` - number of parallel requests to perform at a time,
// - `-n[requests]` - number of requests to perform for the benchmarking session,
// - `-b[body]` - if specified, should sent a random generated body with request,
// - `url` - url which should be used for requests.

const http = require('http');
const program = require('commander');
const axios = require('axios');

program
  .version('0.0.1')
  .option(
    '-c, --concurrency <n>',
    'number of parallel requests to perform at a time',
    1
  )
  .option(
    '-n, --requests <n>',
    'number of requests to perform for the benchmarking session',
    2
  )
  .option(
    '-b, --body [type]',
    'if specified, should sent a random generated body with request'
  )
  .option(
    'url',
    'url which should be used for requests',
    'https://www.google.com/'
  );

program.parse(process.argv);

console.log(program.opts());
const postData = JSON.stringify({
  msg: 'Hello World!',
});

const timeArr = [];

async function makeRequests() {
  for (let i = 0; i < req; i++) {
    const start = Date.now();

    try {
      if (body) {
        await axios.post(url, postData);
      } else {
        await axios.get(url);
      }
    } catch (err) {
      timeArr.push(false);
    }
    const end = Date.now();
    timeArr.push(end - start);
  }
}
makeRequests().then(() => {
  failedRequestsIndex = [];

  let sum = 0;
  for (let item of timeArr) {
    if (item === false) {
      continue;
    } else {
      sum += item;
    }
  }
  let average = sum / timeArr.length;

  console.log(`bombared ${url}`);
  console.log(`${req} requests in ${sum} ms`);
  console.log(
    `successfull requests ${timeArr.length - failedRequestsIndex.length}`
  );
  console.log(`${failedRequestsIndex.length} requests failed`);

  for (let i = 0; i < timeArr.length; i++) {
    if (timeArr[i] === false) {
      console.log(`failed request ${i}`);
    } else {
      console.log(`request ${i} took ${timeArr[i]} ms`);
    }
  }

  console.log(`average request time ${average} ms`);
});
