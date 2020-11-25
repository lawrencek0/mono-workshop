const express = require('express');
const http = require('http');
const process = require('process');
const WebSocket = require('ws');
const rp = require('request-promise');
const TwitterClient = require('./TwitterClient');
const Tweet = require('./Tweet');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const client = new TwitterClient();
// const data = require('./data');
client.getToken();
let lastId;

function tweets(ws, term) {
  client
    .getTweets(term, lastId)
    .then(res =>
      res.statuses.map(tweet => new Tweet(tweet.id, tweet.user.name, tweet.text, tweet.created_at))
    )
    .then(res => {
      console.log('Sending tweets for analysis');
      return res;
    })
    .then(tweets =>
      rp.post('http://localhost:16006/api', {
        body: {
          tweets
        },
        json: true
      })
    )
    .then(tweets => {
      console.log(tweets);
      return tweets;
    })
    .then(tweets =>
      tweets.map((tweet, index) => {
        ws.send(JSON.stringify(tweet));

        if (index === tweets.length - 1) {
          lastId = tweet.id;
        }
      })
    )
    .then(() => ws.send(JSON.stringify({ success: true, message: 'Analyzed tweets' })))
    .catch(console.error);
}

wss.on('connection', ws => {
  ws.on('message', message => {
    const term = JSON.parse(message).term;
    tweets(ws, term);
  });
  lastId = null;
});

server.listen(process.env.port || 8999, () => {
  console.log(`Listening on port ${server.address().port}`);
});
