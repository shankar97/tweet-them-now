import express from 'express';
import { TwitterApi } from 'twitter-api-v2';

const router = express.Router();
const twitterClient = new TwitterApi('AAAAAAAAAAAAAAAAAAAAALBPZQEAAAAAL401wl%2Fl%2BvuzKLz%2B2PZIDJOkNpQ%3DTcto01PuIyjdVx5aG1LthdvihPx3NX4peG9Ec6SLVStNl9WOze');
const roClient = twitterClient.readOnly;

router.get('/', (req, res) => {
    res.send('hit route endpoint');
});

router.get('/findUser/:username', async (req, res) => {
    try {
        console.log('here getting user name');
        const { username } = req.params;
        const twitterUser = await roClient.v2.userByUsername(username);
        if (!twitterUser) {
            res.send(undefined);
        }

        console.log('found user in client', twitterUser.data.id);

        res.send(({ data: twitterUser.data }));
    } catch (error) {
        console.log('error');
        console.log(error);
        res.send('error mfker');
    }
});

router.get('/getUserTweets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userTweets = await roClient.v2.userTimeline(id, { exclude: ["replies", "retweets"] });
        const last1000 = await userTweets.fetchLast(1000);

        if (last1000.data.data.length < 100) {
            res.send("Not enough tweets, sorry honey");
            return;
        }

        res.send({ tweets: userTweets.data.data });
    } catch (error) {
        console.log('error mfker');
        console.log(error);
        res.send(error);
    }
});

export default router;
