// https://riptutorial.com/html5-canvas/example/14974/basic-loading-and-playing-a-video-on-the-canvas-

// SETUP
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var videoContainers = []; // objects to hold video and associated info

resizeCanvasToDisplaySize(canvas);

const videos = [
    // {
    //     id: 'flower',
    //     src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
    //     top: 100,
    //     left: 100,
    //     width: 200,
    //     moveTop: 400,
    //     moveLeft: 100,
    // },
    // {
    //     id: 'bunny',
    //     src: 'https://ia600300.us.archive.org/17/items/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
    //     top: 400,
    //     left: 500,
    //     width: 400,
    //     moveTop: -200,
    //     moveLeft: -100,
    // }
    {
        id: 'pestily'
    }
]

videos.forEach(videoConfig => {
    let video = document.createElement('video')
    video.src = videoConfig.src
    // the video will now begin to load.
    // As some additional info is needed we will place the video in a
    // containing object for convenience

    video.autoPlay = false; // ensure that the video does not auto play
    video.loop = true; // set the video to loop.
    const videoContainer = {
        video : video,
        ready : false,  
        ...videoConfig 
    }
    videoContainers.push(videoContainer);

    video.oncanplay = readyToPlayVideo(videoContainer); // set the event to the play function that can be found below

});

let start, prevTimestamp;
let done = false;
const animationDuration = 3000;

// ANIMATE
// the video can be played so hand it off to the display function
requestAnimationFrame(updateCanvas);


// FUNCTION LIBRARY
function readyToPlayVideo(videoContainer){
    return function(event) {
        videoContainer.ready = true;
    }
}

function updateCanvas(timestampOfPreviousFrame){
    if(start === undefined && !videoContainers[0].video.paused) {
        start = timestampOfPreviousFrame
    }
    const elapsed = timestampOfPreviousFrame - start;
    const percentElapsed = Math.min(elapsed / animationDuration, 1);


    ctx.clearRect(0,0,canvas.width,canvas.height); // Though not always needed 
                                                     // you may get bad pixels from 
                                                     // previous videos so clear to be
                                                     // safe

    videoContainers.forEach(videoContainer => {
        // only draw if loaded and ready
        if(videoContainer !== undefined && videoContainer.ready){ 
            // find the top left of the video on the canvas
            var vidW = videoContainer.width;
            var scale = videoContainer.width / videoContainer.video.videoWidth
            var vidH = videoContainer.video.videoHeight * scale;
            // var top = canvas.height / 2 - (vidH /2 ) * scale;
            // var left = canvas.width / 2 - (vidW /2 ) * scale;
            // var top = 0;
            // var left = 0;
            var top = videoContainer.top + (videoContainer.moveTop * percentElapsed)
            var left = videoContainer.left + (videoContainer.moveLeft * percentElapsed)
            // // now just draw the video the correct size
            ctx.drawImage(videoContainer.video, left, top, vidW, vidH);
            // console.log({id: videoContainer.id, video: videoContainer.video, left, top, vidW, vidH, canvasW: canvas.width, canvasH: canvas.height})

            // var top = canvas.height / 2 - (vidH /2 ) * scale;
            // var left = canvas.width / 2 - (vidW /2 ) * scale;
            // now just draw the video the correct size
            // ctx.drawImage(videoContainer.video, left, top, vidW * scale, vidH * scale);
            // console.log({vid: videoContainer.video, left, top,vidW, vidWScaled: vidW * scale, vidH, vidHScaled: vidH * scale, canvasW: canvas.width, canvasH: canvas.height})
            
        }
    });
    if(videoContainers[0].video.paused){ // if not playing show the paused screen 
        drawPayIcon();
        start = undefined
    }
    // all done for display 
    // request the next frame in 1/60th of a second
    requestAnimationFrame(updateCanvas);
}

function drawPayIcon(){
    ctx.fillStyle = "black";  // darken display
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#DDD"; // colour of play icon
    ctx.globalAlpha = 0.75; // partly transparent
    ctx.beginPath(); // create the path for the icon
    var size = (canvas.height / 2) * 0.5;  // the size of the icon
    ctx.moveTo(canvas.width/2 + size/2, canvas.height / 2); // start at the pointy end
    ctx.lineTo(canvas.width/2 - size/2, canvas.height / 2 + size);
    ctx.lineTo(canvas.width/2 - size/2, canvas.height / 2 - size);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1; // restore alpha
}    

function playPauseClick(){
    videoContainers.forEach(videoContainer => {
        if(videoContainer !== undefined && videoContainer.ready){
            if(videoContainer.video.paused){                                 
                videoContainer.video.play();
            }else{
                videoContainer.video.pause();
            }
        }
    })
}
// register the event
canvas.addEventListener("click",playPauseClick);
                                  


function resizeCanvasToDisplaySize(canvas) {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
 
    // If it's resolution does not match change it
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
 
    return false;
 }