# What is Twitch: a streaming wall

Twitch https://twitch.tv is a platform for people to broadcast a live video stream to the world, and create communities around shared live experiences. Twitch is an online window the world as it exists at this moment. What does this world look like? (A lot of video games)

* **Stage 1:** Can we do a 2d masonry? https://codepen.io/danlaush/pen/vrmedE
   * Using [Packery](https://packery.metafizzy.co/) for layout. [Masonry thoughts](#masonry)

![Paper sketch screenshot. A grid of video players displayed in a 16:9 window](./docs/sketch-small.jpg)

* Digital installation: a screen, as large and with as many pixels as possible. Think jumbotron or billboard sized.
* A masonry grid layout, with ~~16:9~~ boxes of varying sizes. They nest together like puzzle pieces to form a 16:9 rectangle, the whole screen.
    * Might be easier to build the layout with a variety of aspect ratios. Details on cropping down below.
* Each box shows a popular live stream active at that moment, say from a list of the top 50 streamers.
    * Normalise by category to show more of a cross section
* The size of each box is determined by the number of streamers watching that stream at that moment.
    * More viewers, bigger portion of the screen
* Have to decide if the focus is to actually be able to follow the content of the more popular streams or just to take in the variety (or similarity) of what's happening on Twitch
* **Image this in VR** You're in the middle of a sphere looking outward at a 3d projected map of twitch streams. Point your cursor at a video and it shows some metadata about it.

![Reference image of gallery installation](./docs/gallery.jpg)
_Image a wall of this size, with a collage of video streams all going at once. This is Twitch. Gallery installation from Adam Pendleton. Source: [Pinterest](https://www.pinterest.com.au/pin/311944711666527682/) (Original link is a 404)_

![Mockup sreenshot. A grid of video streams all playing at the same time.](./docs/mockup.jpg)

## `ａｌｇｏｒｉｔｈｍ`

* Determine how many streamers to display on the screen (ex: 10, 20, 50)
* Fetch the data of X streamers 
    * Stream embed url & viewer count, other data
    * “Top streams” - a mixture of top streams in a variety of categories. An interesting and sensible cross section.
* Make a total of the viewer count of all of the fetched streams
* For each streamer, calculate the percentage of their viewer count of that total - this is the percentage of screen that will be allotted to that video feed.
* Would the masonry layout always fit cleanly in a 16:9 space if all of the items given to it were also 16:9 and were sized as proportions of a 100% total
* Want the placement of the grid pieces, the masonry, to feel randomised. 
    * Not just largest objects in the middle, smallest around the outside. A scattered array of video streams in varying sizes. 
    * Looks random but natural that they all fit togethers
* Update at some frequency
    * MVP: Refresh every [X intervals]
    * Phase 2: natural feeling mutation of size as a stream grows and wanes in popularity. 
    * Boxes shift around the screen as they move to accommodate streams that start and end

![Reference image of WinDirStat](./docs/windirstat.png)
_WinDirStat of my C:\ drive_

## Nice to haves

* A visual indicator of when “big shit” is happening in a stream
    * Watch velocity & acceleration of chat volume on each stream, so activity is normalised by that particular stream. 
    * Temporary bump in size? 
* Rotate audio streams. Switch to audio of streams where big shit is happening.

### Like this but not this

* [https://css-tricks.com/seamless-responsive-photo-grid/](https://css-tricks.com/seamless-responsive-photo-grid/)
* [masonry layout random size locked aspect ratio css js](https://www.google.com.au/search?q=masonry+layout+random+size+locked+aspect+ratio+css+js&oq=masonry+layout+random+size+locked+aspect+ratio+css+js)
* [css grid random sizes](https://www.google.com.au/search?q=css+grid+random+sizes)
* [Aspect Ratios for Grid Items - CSS Tricks Chris Coyier](https://css-tricks.com/aspect-ratios-grid-items/)

### Twitch mobile app cropping

![Twitch mobile app](./docs/twitch-mobile-app.gif)
_Source: [Twitch blog](https://blog.twitch.tv/new-twitch-mobile-app-available-now-aa527264091b)

* The gif illustrates how the Twitch mobile app handles rotation. 
* It seems natural/supported to clip streams to different aspect ratios. 
* It would be useful for generating a sensible array of rectangles to make a 16:9 total picture if it could be a mixture of aspect ratios of videos. 
* It would simplify the math required to generate the grid. (I made that last sentence up. It just seems like it would be easier somehow.)

I feel like this would be most effective with the highest viewer count streams available as a way to smooth out the speed of transitions. The velocity and acceleration of viewer count would be the most reliable and least likely to spike by ridiculous percentages in viewers very quickly. Unreliable velocity would result in awkwardly-quick changes in size for particular streams. I want to watch the screen grow and change over the course of hours, with brief attention-grabbing “big moments” on those streams.

### Boy that sure sounds like a lot of bandwidth

20 streams is a lot of streaming video at once. Maybe start with showing a recent screenshot for the stream and update the image every [X intervals]. Twitch keeps track of this for icons on the site, is it available in the API? Sub in the video stream for the top Y biggest streams.

Although why waste the NBN? Fill the tubes.

## Masonry

Packery is a good first start. I think if I organise my grid options a bit better I can eliminate more empty space. How can I make sure the layout is "interesting" every time, like make sure the sizes are mixed up and it's not all the big ones in one corner.

Not sure if Packery will work long term. The goal is to have the sizes of the boxes grow and shrink over time, and I think Packery "updates" by removing and replacing all the divs every time. This would likely interrupt stream playback. Might have to roll my own. Google: bin-packing algorithm.
