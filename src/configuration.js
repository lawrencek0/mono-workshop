'use strict';

var config = {
    appId : 'amzn1.ask.skill.084be93c-6ee0-4bb4-bdb9-504cc6004918',
    welcome_message : 'Welcome to ULM News Feed Skill',
    number_feeds_per_prompt : 3,
    speak_only_feed_title : true,
    display_only_title_in_card : true,
    feeds : {
        'ULM News Center' : 'http://www.ulm.edu/news/rss/news.xml',
        'ULM Warhawks News' : 'http://www.ulmwarhawks.com/rss.dbml?db_oem_id=19000&media=news',
    },
    speech_style_for_numbering_feeds : 'Item',
    s3BucketName : 'my-ulm-news-feed-reader',
    dynamoDBTableName : 'myULMNewsFeedTable',
    dynamoDBRegion : 'us-east-1'
};

module.exports = config;