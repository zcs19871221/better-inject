class {
  getSource(filePaths) {}

  getClass(filePath) {
    const classEntity = require(filePath).default;
  }

  getDefinion() {}

  registClass() {}
}

const defination = {
  name: {
    alias: [],
    depends: [
      {
        index: 0,
        name: 'sss',
      },
    ],
  },
};
