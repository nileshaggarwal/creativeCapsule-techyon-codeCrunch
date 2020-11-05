require('dotenv').config();
let Twit = require('twit');
let log = console.log;

class TweetApi {
    constructor() {
        this.T = new Twit({
                consumer_key: process.env.CONSUMER_KEY,
                consumer_secret: process.env.CONSUMER_SECRET,
                access_token: process.env.ACCESS_TOKEN,
                access_token_secret: process.env.ACCESS_TOKEN_SECRET
            }),
            this.errorMessage = {
                status: 404,
                message: "Tweets not found"
            }
    }

    getTweetsByUsername(user_name) {
        return new Promise((resolve, reject) => {
            this.T.get('statuses/user_timeline', {
                screen_name: `${user_name}`,
                count: 10
            }, (error, response) => {
                if (error)
                    reject(this.errorMessage);
                else if (response.length === 0)
                    reject(this.errorMessage);
                else {
                    let user = this.getUser(user_name);
                    user
                        .then(res => {
                            let data = Object.assign({}, res);
                            let tweets = [];

                            response.map(tweet => {
                                tweets.push({
                                    created_at: tweet.created_at,
                                    text: tweet.text
                                })
                            })
                            data.tweets = tweets;
                            resolve(data)
                        })
                        .catch(err => reject(err));
                }
            })
        })
    }

    getUser(user_name) {
        let userData;
        return new Promise((resolve, reject) => {
            this.T.get('users/show', {
                screen_name: `${user_name}`
            }, (error, response) => {
                if (error)
                    reject(this.errorMessage)
                else {
                    userData = {
                        user_name: response.name,
                        user_screen_name: response.screen_name,
                        followers_count: response.followers_count,
                        friends_count: response.friends_count
                    }
                }
                resolve(userData)
            })
        })

    }

    getTweetsByHashtag(hashtag) {
        return new Promise((resolve, reject) => {
            this.T.get('search/tweets', {
                q: `#${hashtag}`,
                count: 10
            }, (error, response) => {
                if (error)
                    reject(this.errorMessage);
                else if (response.statuses.length === 0)
                    reject(this.errorMessage);
                else {
                    let data = [];
                    let tweets = response.statuses;
                    tweets.map((tweet) => {
                        data.push({
                            text: tweet.text,
                            user_screen_name: tweet.user.screen_name,
                            retweet_count: tweet.retweet_count
                        })
                    })
                    resolve(data);
                }
            })
        })
    }

    getTweetsByGeocode(geocode) {
        let {
            latitude,
            longitude,
            radius
        } = geocode;

        return new Promise((resolve, reject) => {
            this.T.get('search/tweets', {
                geocode: `${latitude},${longitude},${radius}`,
                count: 2
            }, (error, response) => {
                if (error)
                    reject(this.errorMessage);
                else if (response.statuses.length === 0)
                    reject(this.errorMessage);
                else {
                    let data = [];
                    let tweets = response.statuses;
                    tweets.map((tweet) => {
                        data.push({
                            text: tweet.text,
                            user_screen_name: tweet.user.screen_name,
                        })
                    })
                    resolve(data);
                }
            })
        })
    }
}

module.exports = new TweetApi();