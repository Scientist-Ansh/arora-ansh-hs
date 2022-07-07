#!/usr/bin/env node

// create a simple cli tool to benchmark a server using commander library
// following options can be used:
// - `-c[concurrency]` - number of parallel requests to perform at a time,
// - `-n[requests]` - number of requests to perform for the benchmarking session,
// - `-b[body]` - if specified, should sent a random generated body with request,
// - `url` - url which should be used for requests.

const async = require('async');
const http = require('http');
const program = require('commander');
const axios = require('axios');
const chalk = require('chalk');

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

const { concurrency, requests: req, body, url } = program.opts();
const postData = JSON.stringify({
  msg: 'Hello World!',
});

function* createRequestFunctions() {
  for (let i = 0; i < req; i++) {
    yield (callback) => {
      const start = Date.now();
      if (body) {
        axios
          .post(url, postData)
          .then(() => {
            const end = Date.now();
            callback(null, end - start);
          })
          .catch(() => {
            callback(null, false);
          });
      } else {
        axios
          .get(url)
          .then(() => {
            const end = Date.now();
            callback(null, end - start);
          })
          .catch(() => {
            callback(null, false);
          });
      }
    };
  }
}

let successfulReq = 0;
let failedReq = 0;
let totalTime = 0;
let timeArr = [];
let c = parseInt(concurrency);
c = c > 0 ? c : 1;

async.parallelLimit([...createRequestFunctions()], c, (err, results) => {
  if (err) {
  } else {
    for (const result of results) {
      if (result === false) {
        failedReq = failedReq + 1;
      } else {
        successfulReq = successfulReq + 1;
        totalTime = totalTime + result;
      }
      timeArr.push(result);
    }

    console.log(`bombared ${chalk.blue(url)}`);
    console.log(
      `Made ${chalk.green(req)} requests in ${chalk.yellow(totalTime)} ms`
    );
    console.log(`${chalk.yellow(c)} requests were made at a time`);
    console.log(`successfull requests ${chalk.green(successfulReq)}`);
    console.log(`${chalk.red(failedReq)} requests failed`);

    for (let i = 0; i < timeArr.length; i++) {
      if (timeArr[i] === false) {
        console.log(`failed request ${i}`);
      } else {
        console.log(
          `request ${chalk.blue(i)} took ${chalk.yellow(timeArr[i])} ms`
        );
      }
    }
    console.log(`average request time ${chalk.yellow(totalTime / req)} ms`);
  }
});
