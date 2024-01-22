export default async function topStreams(req, res) {
  try {
      const count = req.query.count || 10;
      const data = await fetch(`https://api.twitch.tv/helix/streams?first=${count}`, {
          headers: {
              Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
              'Client-ID': process.env.TWITCH_CLIENT_ID,
          }
      }).then(res => res.json())
      res.send(data)
  } catch (error) {
      console.log('Error fetching top streams from Twitch', error)     
      res.status(500).json({error:'Error fetching top streams from Twitch'})
  }
}