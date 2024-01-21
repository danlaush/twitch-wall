import express from "express";
import 'dotenv/config'

const {TWITCH_ACCESS_TOKEN,TWITCH_CLIENT_ID} = process.env;

const app = express();

app.use(express.static('public'))

app.get("/topStreams", async (req, res) => {

    try {
        const count = req.query.count || 10;
        const data = await fetch(`https://api.twitch.tv/helix/streams?first=${count}`, {
            headers: {
                Authorization: `Bearer ${TWITCH_ACCESS_TOKEN}`,
                'Client-ID': TWITCH_CLIENT_ID,
            }
        }).then(res => res.json())
        res.send(data)
    } catch (error) {
        console.log('Error fetching top streams from Twitch', error)     
        res.status(500).json({error:'Error fetching top streams from Twitch'})
    }
});

app.listen(8000);
