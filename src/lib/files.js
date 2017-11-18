import fs from 'fs';
import path from 'path';

class Files {
  getWorkingDirectoryBase() {
    return path.dirname(__dirname);
  }
  directoryExists(filePath) {
    try {
      return fs.stat(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  }
}

export default Files;
