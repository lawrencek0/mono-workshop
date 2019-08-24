This repo holds Team Yellow's Client App for ULM's Fall 2019 CSCI 4060-44495 Principles of Software Engineering's Project.

## Usage

Note: You can view the Onboarding documentation [here](docs/onboarding.md) if you are getting started for the first time.

```
git clone https://github.com/lawrencek0/team-yellow-client
cd team-yellow-client/
npm install
npm start
```

## Contributing

To get started working on the repo, follow the following steps:

1. Pick an issue from the `Issues` tab and assign it to yourself.
2. Make sure to pull the latest changes from master with `git pull origin master`
3. Create a separate branch with the issue number such as `git checkout -b fix-234-add-search-function`
4. After you are finished, push to remote with the same branch name such as `git push origin fix-234-add-search-function`
5. Go to the repo's page on GitHub and you should see an option to open up a pull request.
6. Open up the Pull Request with the issue number at the end like `Add Search Function (fixes #234)` as it will close the corresponding issue once its approved.
7. Assign us to review your changes.
8. If everything is okay, we will merge it to `master`.

## Tech Stack Info

This project uses the following libraries and tools:

### Front End:

-   [React](https://reactjs.org/): Library for building user interfaces

### Dev/Productivity Tools:

-   [TypeScript](https://www.typescriptlang.org/): Typed superset of JavaScript
-   [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for linting and code formatting
-   [lint-staged](https://github.com/okonet/lint-staged) and [Husky](https://github.com/typicode/husky) for linting git staged files and git hooks
-   [Slack](https://slack.com/) for communication, [Trello](https://trello.com/teamyellow4ulm) for boards, and [Google Docs](https://drive.google.com/drive/) for storages and docs sharing

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
