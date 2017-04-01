# Weather App
It allows the user to search for Wikipedia articles with autocomplete search functionality or
read a random Wikipedia article.

You can check it out [here](http://codepen.io/LKhadka/pen/yOKKjv).

## Info
This app uses [MediaWiki action API](https://www.mediawiki.org/wiki/API:Main_page/) to search for Wikipedia
articles or to open a random article. It also uses Twitter's
[typeahead.js](https://github.com/twitter/typeahead.js/) to add autocomplete search functionality.
Bloodhound is used to filter the response and Typeahead is triggered whenever the user enters anything in
the input field.

## Usage
1.  Clone the repo

    ```bash
    git clone https://github.com/LKhadka/weather-app.git
    ```
2. Open the Directory you want to run

    ```bash
    cd weather-app
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
