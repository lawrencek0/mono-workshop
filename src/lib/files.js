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
      return false;
    }
  }
}

export default Files;
