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

function getCreds(callback) {
  const questions = [
    {
      name: 'email',
      type: 'input',
      message: 'Enter your PET e-mail address:',
      validate(value) {
        if (value.length) {
          return true;
        }
        return 'Please enter your e-mail address.';
      }
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate(value) {
        if (value.length) {
          return true;
        }
        return 'Please enter your password.';
      }
    }
  ];

  inquirer.prompt(questions).then(callback);
}
