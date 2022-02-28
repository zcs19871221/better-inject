const path = require('path');
const fs = require('better-fs');

fs.removeSync(path.join(__dirname, '../dist/test'));
