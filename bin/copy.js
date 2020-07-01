const path = require('path');
const fs = require('better-fs');

fs.copy(
  path.join(__dirname, '../package.json'),
  path.join(__dirname, '../dist'),
);
fs.copy(path.join(__dirname, '../readme.md'), path.join(__dirname, '../dist'));
