// import 'https://cdn.skypack.dev/@babel/plugin-transform-react-jsx-source';
import 'https://esm.sh/preact/debug';
import { h, Component, Fragment, render } from 'https://esm.sh/preact';
import { useState, useEffect, useRef } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';

let pckry
// Initialize htm with Preact
const html = htm.bind(h);

const DEBUG_STATIC = false;
const STREAM_COUNT_DEFAULT = 30;
const UPDATE_STREAMS_INTERVAL_MS = 45000;
const TRANSITION_INTERVAL_MS = 45000;

const mediaSizeMax = 640;
const mediaSizeMin = 100;

function App (props) {
    const [streams, setStreams] = useState([])
    const [streamCount, setStreamCount] = useState(STREAM_COUNT_DEFAULT);
    const [videoCount, setVideoCount] = useState(2);
    const videoCountRef = useRef();
    const streamCountRef = useRef()
    const intervalRef = useRef()

    // the setInterval() callback freezes video count
    // use a ref to create a global variable
    // https://stackoverflow.com/a/60643670
    videoCountRef.current = videoCount; 
    streamCountRef.current = streamCount; 

    function updateStreams() {
        fetchTopStreams(streamCountRef.current)
            .then(streams => streams.map((stream, index) => ({
                ...stream,
                showStream: index < videoCountRef.current
            })))
            .then(streams => {
                const shuffled = shuffle(streams)
                setStreams(shuffled)
            })
            .then(s => {
                pckry.reloadItems()
                pckry.layout()
            })
    }

    function triggerUpdateStreams() {
        updateStreams()
        intervalRef.current = setInterval(updateStreams, UPDATE_STREAMS_INTERVAL_MS)
    }

    useEffect(() => {
        var streamContainer = document.querySelector('#streams');
        pckry = new Packery(streamContainer, {
            itemSelector: '#streams li',
            transitionDuration: `${TRANSITION_INTERVAL_MS}ms`
        });
        triggerUpdateStreams()
    }, [])

    return html`
        <div id="app">
            <details id="controls">
                <summary><span class="sr-only">Settings</span></summary>
                <ul>
                    <li>
                        <label for="streamCount">Stream count</label>
                        <input id="streamCount" type="number" value=${streamCount} onchange=${e => setStreamCount(Number(e.target.value))} />
                    </li>
                    <li>
                        <label for="videoCount">Video count</label>
                        <input id="videoCount" type="number" value=${videoCount} onchange=${e => setVideoCount(Number(e.target.value))} />
                    </li>
                </ul>
                <button onclick=${() => triggerUpdateStreams()}>Update</button>
            </details>
            <ul id="streams">
                ${streams.map(s => html`
                    <li key=${s.user_name}>
                        ${!DEBUG_STATIC && s.showStream
                            ? html`<iframe
                                src="https://player.twitch.tv/?channel=${s.user_name}&parent=localhost&muted=true"
                                width=${s.size}
                                height=${s.size/16*9}
                                allowfullscreen
                                style="width:${s.size}px; height: ${s.size/16*9}px;">
                            </iframe>`
                            : html`<img
                                src="${s.thumbnail_url.replace('{width}',640).replace('{height}', 360)}"
                                width=${s.size}
                                height=${s.size/16*9}
                                style="width:${s.size}px; height: ${s.size/16*9}px;"
                            />` 
                        }
                        <a href="https://twitch.tv/${s.user_name}">${s.user_name}</a>
                    </li>
                `)}
            </ul>
        </div>
    `
    // 
}

render(html`<${App} />`, document.body);

/**
 * Maps a value from one range to its equivalent point in another range. https://stackoverflow.com/a/14224813
 * @param {Number} value 
 * @param {Number[]} r1 
 * @param {Number[]} r2 
 * @returns Number
 */
function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

async function fetchTopStreams(count) {
    return await fetch(`/topStreams?count=${count}`)
        .then(checkOk)
        .then(res => res.json())
        .then(({data}) => {
            const viewerCountMax = data[0].viewer_count;
            const viewerCountMin = data[data.length-1].viewer_count;
            return data.map((stream, index) => {
                const size = convertRange(stream.viewer_count, [viewerCountMin, viewerCountMax], [mediaSizeMin, mediaSizeMax])
                // const position = getPosition(size);
                return {
                    id: stream.id,
                    user_name: stream.user_name,
                    viewer_count: stream.viewer_count,
                    game_name: stream.game_name,
                    thumbnail_url: stream.thumbnail_url,
                    size
                }
            })
        })
}
// via https://stackoverflow.com/a/2450976
function shuffle(array) {
var currentIndex = array.length, temporaryValue, randomIndex;

// While there remain elements to shuffle...
while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
}

return array;
}

function checkOk(res) {
    if(!res.ok) {
        throw new Error('There was an error fetching data from Twitch', res.statusCode, res.statusText)
    }
    return res
}
