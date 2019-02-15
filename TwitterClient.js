const rp = require('request-promise');

class TwitterClient {
  constructor() {
    this.base_url = 'https://api.twitter.com';
  }

  async getToken() {
    const res = await rp.post(`${this.base_url}/oauth2/token`, {
      headers: {
        Authorization:
          'Basic  YzdQQVZyWWM0YTluOFpaZVhyS2xDVTdUZzpUR0JmbWdUMm9Za0t0UFJvTUNIdGphNTZ5bnJBVzdMZFBBNGE0bFg1UU1vcE91Y3A5Tw=='
      },
      formData: {
        grant_type: 'client_credentials'
      },
      json: true
    });
    this.token = await res.access_token;
  }

  async getTweets(query, lastId) {
    console.log('Searching for tweets on ' + query);
    return rp.get(`${this.base_url}/1.1/search/tweets.json`, {
      headers: {
        authorization: `Bearer ${this.token}`
      },
      qs: {
        q: query,
        lang: 'en',
        count: 5,
        include_entities: false,
        since_id: lastId
      },
      json: true
    });
  }
}

module.exports = TwitterClient;
