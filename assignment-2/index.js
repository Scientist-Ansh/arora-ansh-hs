const fs = require('fs');
const path = require('path');

const { stat } = fs.promises;

const targetDir = process.argv[2] || process.cwd();

fs.readdir(targetDir, async (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const filePromises = files.map(async (file) =>
    stat(path.join(targetDir, file))
  );
  const resolvedFiles = await Promise.all(filePromises);

  resolvedFiles.forEach((file, index) => {
    if (!file.isFile()) {
      console.log('d : ' + files[index]);
    } else {
      console.log('f : ' + files[index]);
    }
  });
});
