const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

clear();
console.log(
  chalk.magenta(figlet.textSync('Phage Updater', { horizontalLayout: 'full' }))
);
