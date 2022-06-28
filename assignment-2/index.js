const fs = require('fs');
const path = require('path');
const { stat } = fs.promises;
const program = require('commander');
const tree = require('../assignment-1/index');

program
  .version('0.0.1')
  .description('Prints a tree of the directory structure')
  .option('-d, --depth <n>', 'Depth of the directory tree', 1)
  .option('value', 'Path to the directory', process.cwd());

program.parse(process.argv);

const { depth, value } = program.opts();
console.log(depth, 'depth');
console.log(value, 'path');

function getFiles(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

let baseObj = {
  name: path.basename(value),
};
let currentDepth = 0;
async function createDirectoryObject(dir, obj) {
  obj.items = [];

  const files = await getFiles(dir);
  for (let file of files) {
    obj.items.push({
      name: file,
    });
  }

  if (currentDepth >= depth) {
    return;
  }
  for (let item of obj.items) {
    const filePath = path.join(dir, item.name);
    const stats = await stat(filePath);
    if (stats.isDirectory()) {
      await createDirectoryObject(filePath, item);
    }
  }
  currentDepth++;

  return;
}

createDirectoryObject(value, baseObj).then(() => {
  console.log(tree(baseObj));
});
