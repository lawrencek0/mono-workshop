# Random Quote Generator
Generates random quote

## Info
This app uses [Andruxnet's API](https://market.mashape.com/andruxnet) to generate random quotes. It allows the users to 
copy the entire quote to clipboard on the click of a button and tweet it using
[Twiiter's Web Intents](https://dev.twitter.com/web/intents).  

Materialize Toasts are used whenever an action button is clicked and spin.js is used whenever a new quote is requested.

## Usage
1.  Clone the repo

    ```bash
    git clone https://github.com/LKhadka/random-quote-generator.git
    ```
2. Open the Directory you want to run

    ```bash
    cd random-quote-generator
    ```
3. Install project related dependencies
       
    ```bash
    npm install
    ```
4.  Run Server

    ```bash
    npm start
    ```
5. Navigate to `http://localhost:8080`

## Future Plans
1. Handle errors.
2. Add Facebook share functionality
3. Rewrite the app in Angular and Ionic