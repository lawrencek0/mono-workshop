import Nightmare from 'nightmare';
import Preferences from 'preferences';
import { Spinner } from 'clui';
import chalk from 'chalk';
import clear from './lib/clear';
import figlet from 'figlet';
import inquirer from 'inquirer';
import realMouse from 'nightmare-real-mouse';
realMouse(Nightmare);
clear();
console.log(
  chalk.yellowBright(
    figlet.textSync('PhageDB Updater', {
      horizontalLayout: 'controlled smushing',
      verticalLayout: 'full'
    })
  )
);

async function loginToPET() {
  const prefs = new Preferences('pet.tools.updater');
  if (!prefs.email || !prefs.password) {
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

    await inquirer.prompt(questions).then(({ email, password }) => {
      prefs.email = email;
      prefs.password = password;
    });
  }
  tryToLogin(prefs);
}

async function tryToLogin(prefs) {
  const { email, password } = prefs;
  const status = new Spinner('Authenticating you, please wait...');
  status.start();
  const nightmare = new Nightmare({ show: true });
  try {
    await nightmare
      .goto('http://phageenzymetools.com/login')
      .wait('input#inputEmail')
      .insert('input#inputEmail', email)
      .insert('input#inputPassword', password)
      .click('input#inputPassword + button.btn')
      .exists('span[style="color: red; "]')
      .then(function(result) {
        status.stop();
        if (result) {
          nightmare.end().then(() => {
            console.log(
              chalk.red(
                `${chalk.bgBlackBright(
                  'ERROR!'
                )} Invalid Email or password!! Try Again!`
              )
            );
            prefs.clear();
            fetchCreds();
          });
        } else {
          console.log(
            chalk.green(`${chalk.bgBlackBright('SUCCESS!')} Logged In!`)
          );
        }
      });
  } catch (e) {
    console.error(e);
  }
  selectPhage(nightmare);
}

async function selectPhage(nightmare) {
  try {
    await nightmare
      .wait('ul.nav-sidebar')
      .click('a[href="known_phage_visualization"]')
      .wait('ul.tabs')
      .click('input[placeholder="Search Genera"]')
      .wait('li[id$="-Actinoplanes"]')
      .realClick('li[id$="-Bacillus"]')
      .click('input[placeholder="Search Enzymes"]')
      .wait('li[id$="-AanI"]')
      .realClick('li[id$="-AanI"]')
      .realClick('a#searchCriteriaTab')
      .click('button#submit')
      .wait('table#cutTable')
      .scrollTo(500, 0)
      .select('#cutTable_length select[name="cutTable_length"]', '100')
      .wait();
  } catch (e) {
    console.error(e);
  }
}

loginToPET();
