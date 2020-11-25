const Router = require('express').Router;

const router = Router();

router.get('/analyze', async (req, res) => {
  try {
    const term = req.query.term;
    const result = await client.getTweets(term);
    const tweets = await result.statuses.map(
      tweet => new Tweet(tweet.id, tweet.text, tweet.user.name, tweet.created_at)
    );
    return res.json({ tweets });
  } catch (error) {
    console.error(error);
    return res.json({ problemo: error });
  }
});

module.exports = router;
