import fs from 'fs';
import path from 'path';

class Files {
  getWorkingDirectoryBase() {
    return path.dirname(__dirname);
  }
  directoryExists(dirname) {
    try {
      return fs
        .statSync(`${this.getWorkingDirectoryBase()}/${dirname}`)
        .isDirectory();
    } catch (err) {
      return false;
    }
  }
  makeDir(dirname) {
    try {
      if (!this.directoryExists(dirname)) {
        fs.mkdirSync(dirname);
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  fileExists(fileName) {
    try {
      return fs
        .statSync(`${this.getWorkingDirectoryBase()}/${fileName}`)
        .isFile();
    } catch (err) {
      return false;
    }
  }
  saveFile(file, data) {
    try {
      fs.writeFileSync(`${this.getWorkingDirectoryBase()}/${file}`, data);
    } catch (err) {
      console.error(err);
    }
  }
  getFile(file) {
    if (this.fileExists(file)) {
      return `${this.getWorkingDirectoryBase()}/${file}`;
    }
  }
}

export default Files;
