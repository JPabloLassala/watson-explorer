# Watson Explorer

Helper service made with the purpose of making some IBM Watson operations easier

## Features

Currently it supports the following operations:

* Get a node from its ID
* Get a node and all of its children based on its title
* Copy a node and all of its children on another Watson Skill

Project Layout
```
.
├── src                 Source files
│   ├── config           Configuration Loaders and singletons
│   ├── constants       Application constants
│   ├── controllers     Controller classes to handle HTTP requests
│   ├── helpers         Utility classes for the applications
│   ├── middlewares     Add ons for Express. E.g.: To handle all unhandled exceptions
│   ├── repositories    Classes that deal with the data sources
│   ├── routes          Definition of every route for the application
│   ├── utils           Utility classes for Express and the infrastructure
│   ├── validations     Methods that specify a format for the request body and parameters
│   ├── app.js          Main function to execute API methods 
│   └── server.js       Main function to execute the Express server
├── .babelrc            Config file for Babel
├── .editorconfig        Editorconfig file
├── .env                Environment variables
├── .eslintignore       Files not parsed by ESLint
├── .eslintrc.yml       ESLint configuration file
├── .gitignore          Files not tracked by GIT
├── .prettierignore     Files not parsed by Prettier
├── package.json        Main project file and dependencies list
└── README.md           This README file
```
