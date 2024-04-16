import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import "./WaveSurferComponent.css";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";


const RegionsComponent = ({ audioPath }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const loopRef = useRef(true); // Use a ref to hold the loop state
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const speeds = [0.25, 0.5, 1, 2, 4];
  const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);

  const randomColor = () => {
    const random = (min, max) => Math.random() * (max - min) + min;
    return `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;
  };

  useEffect(() => {
    loopRef.current = loop; // Update the ref whenever loop state changes
  }, [loop]);

  useEffect(() => {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = window.innerWidth; // or any appropriate width
    ctx.canvas.height = 150; // or your required height

    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0); // Horizontal gradient
    gradient.addColorStop(0, "#12c2e9"); // light blue
    gradient.addColorStop(0.5, "#c471ed"); // purple
    gradient.addColorStop(1, "#f64f59"); // red

    const progressGradient = ctx.createLinearGradient(0, 0, 0, 150);
    progressGradient.addColorStop(0, "rgb(200, 0, 200)"); // darker light blue
    progressGradient.addColorStop(0.7, "rgb(100, 0, 100)"); // darker purple
    progressGradient.addColorStop(1, "rgb(0, 0, 0)"); // darker red

   

    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: gradient,
        progressColor: progressGradient,
        url: audioPath,
        audioRate: 1,
        cursorWidth: 1,
        cursorColor: "black",
        plugins: [
          TimelinePlugin.create(),
          // Minimap.create({
          //     height: 20,
          //     waveColor: '#ddd',
          //     progressColor: '#999',
          //     // the Minimap takes all the same options as the WaveSurfer itself
          //   }),
          Hover.create({
            lineColor: "#ff0000",
            lineWidth: 2,
            labelBackground: "#555",
            labelColor: "#fff",
            labelSize: "11px",
          }),
        ],
      });

      wavesurfer.setVolume(volume);

      const wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());

      wavesurfer.on("ready", () => {
        console.log("WaveSurfer is ready");
        setDuration(wavesurfer.getDuration());
        // Ensure looping is handled correctly
        // region.on('out', () => {
        //   if (loop && isPlaying) {
        //     wavesurfer.play(region.start);
        //   }
        // });

        wsRegions.on("region-updated", (region) => {
          console.log("Updated region", region);
        });



        let activeRegion = null;
        wsRegions.on("region-in", (region) => {
          console.log("region-in", region);
          activeRegion = region;
        });
        wsRegions.on("region-out", (region) => {
          console.log("region-out", region);
          if (activeRegion === region) {
            if (loopRef.current) {
              region.play();
            } else {
              activeRegion = null;
            }
          }
        });
        wsRegions.on("region-clicked", (region, e) => {
          e.stopPropagation(); // prevent triggering a click on the waveform

          activeRegion = region;
          region.play();
          region.setOptions({ color: randomColor() });
        });

        wsRegions.enableDragSelection({
          color: "rgba(255, 0, 0, 0.1)",
        });

        wavesurfer.on("interaction", () => {
          activeRegion = null;
        });
      });

      wavesurfer.on('audioprocess', () => {
        const currentTime = wavesurfer.getCurrentTime();
        console.log('Current Time: ', currentTime); // Log the current time to debug
        setCurrentTime(currentTime);
      });

      wavesurferRef.current = wavesurfer;
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current.un('ready');
        wavesurferRef.current.un('audioprocess');
      }
    };
  }, [audioPath]); // Loop and isPlaying not included here because it does not affect initialization

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };
  const handleSkip = (seconds) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.skip(seconds);
    }
  };

  const handleSpeedChange = (event) => {
    const newRateIndex = parseInt(event.target.value, 10);
    const newRate = speeds[newRateIndex];
    setPlaybackRate(newRate);
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(newRate);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    wavesurferRef.current.setVolume(newVolume);
  };

  const formatTime = (time) => {
    const rounded = Math.round(time);
    const minutes = Math.floor(rounded / 60);
    const seconds = rounded % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <div ref={waveformRef} className="waveform-container">

      <div className="waveform-time-display">

  <span  >{formatTime(currentTime)}</span>
  <span >{formatTime(duration)}</span>

</div>
      </div>
    
      <button onClick={() => handleSkip(-5)}>{"< 5s"}</button>
      <button onClick={() => handleSkip(5)}>{"5s >"}</button>
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <label htmlFor="speedControl">Speed: {playbackRate.toFixed(2)}</label>
      <input
        type="range"
        id="speedControl"
        min="0"
        max={speeds.length - 1}
        defaultValue={2} // Default to index of 1 in the speeds array, which is normal speed
        onChange={handleSpeedChange}
      />
      <div>
        <label>
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
          />
          Loop regions
        </label>
        <label style={{ marginLeft: "2em" }}>
          Zoom:
          <input
            type="range"
            min="10"
            max="1000"
            value={zoomLevel}
            onChange={(e) => {
              const newZoomLevel = Number(e.target.value);
              setZoomLevel(newZoomLevel);
              wavesurferRef.current && wavesurferRef.current.zoom(newZoomLevel);
            }}
          />
          {/* <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} /> */}
        </label>

        <label style={{ marginLeft: "2em" }}>
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </label>
      </div>
    </div>
  );
};

export default RegionsComponent;
