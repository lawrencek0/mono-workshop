# OnBoarding

Welcome to Team Yellow's Repos! This document will help you get started and up and running.

## Local Setup

### Git

Git is a distributed version-control system which we use extensively. Please follow the instructions [here](https://help.github.com/en/articles/set-up-git#setting-up-git) from GitHub to setup Git. Make sure to authenticate your GitHub account from Git otherwise you won't be able to clone/commit to any of our repos.

We have the following repos on GitHub:

-   [Team Yellow Client](https://github.com/lawrencek0/team-yellow-client): The client app built with React.js
-   Team Yellow Server (comming soon)

### SourceTree

[SourceTree](https://www.sourcetreeapp.com/) provides a simple user-interface to visualize and manage repositories. If you prefer to use the git command line tool you don't have to install this tool.

### Node.js

It is recommend to use NVM (Node Version Manager) to install Node.js since the `.exe` file from their Node.js website is known to cause a lot of problems. If you are on Windows, you can use [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) to install nvm.

Once NVM has been installed, install and switch to latest LTS Version on Node.js by running the following commands:

```
nvm install 10.16.3 --latest-npm
nvm use 10.16.3
```

### VSCode

[VSCode](https://code.visualstudio.com) is a free text-editor from Microsoft with a powerful plugin system. It is recommended to use this editor since it integrates very well with TypeScript and has bunch of plugins and tools that offers everything you need to make development smooth and easy.

It is recommended to install the following plugins: ESLint, EditorConfig for VSCode, Debugger for Chrome, GitLens, npm, Path Intellisense, Prettier, and Rainbow Brackets. Note: VSCode may automatically ask you to install some of these plugins.

## Tools

### Google Drive

We post all our documents and meeting notes on our Google Drive. You can request access to them with Lauren and you can access our folder at - [https://drive.google.com/drive/folders/1ZP48WmxVqdSVIwTj23a0qN2hJA-Stis8](https://drive.google.com/drive/folders/1ZP48WmxVqdSVIwTj23a0qN2hJA-Stis8)

### Slack

We use Slack to communicate with each other. We have several channels dedicated to sharing learning resources, Q&A, meeting notes. We also have the Google Drive and trello bots setup to help integrate with those tools right from Slack itself. The workspace is called `team-yellow4ulm` and you can view it at - [https://team-yellow4ulm.slack.com/](https://team-yellow4ulm.slack.com/)

### Trello

We use Trello as our kanban board. We have several different lists for ToDos, Backlogs, WIP. Each item in the Backlog is labelled according to its priority. Usually, the ones at the top are those with the highest priorities and those at the bottom with the least. Every team member picks up an item from the Backlog and moves it to the ToDo list with a certain deadline. Trello is integrated in Slack and a new card can be easily created through the chat bot - `/trello add [teammates] [task title]`. Example: `/trello add @alex Add Search Route on the Server`
