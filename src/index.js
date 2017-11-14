import Preferences from 'preferences';
// import { Spinner } from 'clui';
import chalk from 'chalk';
import clear from './lib/clear';
import figlet from 'figlet';
import inquirer from 'inquirer';

clear();
console.log(
  chalk.yellowBright(
    figlet.textSync('PhageDB Updater', {
      horizontalLayout: 'controlled smushing',
      verticalLayout: 'full'
    })
  )
);
