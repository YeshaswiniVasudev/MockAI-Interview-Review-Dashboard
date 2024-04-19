import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import "./WavesurferComponent.css";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import { PlayIcon, PauseIcon } from "@heroicons/react/solid";
import PlayBackSpeedIcon from "./ui/PlayBackSpeedIcon";
import {
  FastForwardIcon,
  RewindIcon,
  ZoomInIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Region from "wavesurfer.js";
import { ChangeEvent } from "react";


const RegionsComponent = ({
  audioPath,
  transcriptPath,
}: {
  audioPath: string;
  transcriptPath: string;
}) => {
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
  const [transcriptText, setTranscriptText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSpeed, setSelectedSpeed] = useState(1); // Change this line
  const [transcriptData, setTranscriptData] = useState([]);

  useEffect(() => {
    import(`${transcriptPath}`)
      .then((module) => {
        const transcriptData = module.transcriptData;
        setTranscriptData(transcriptData);
      })
      .catch((err) => {
        console.error(`Error loading transcript data: ${err}`);
      });
  }, []);

  useEffect(() => {
    // This effect adjusts currentIndex based on the current time
    const updateIndex = () => {
      const newIndex =
        transcriptData.findIndex(
          (segment: { start: number; text: string }) =>
            currentTime < segment.start
        ) - 1;
      setCurrentIndex(newIndex >= 0 ? newIndex : 0);
      setTranscriptText(
        (transcriptData[currentIndex] as { text: string })?.text || ""
      );
    };

    updateIndex(); // Call on time change
  }, [currentTime, transcriptData]);

  useEffect(() => {
    if (wavesurferRef.current) {
      (wavesurferRef.current as typeof WaveSurfer).on(
        "seek",
        (seekRatio: number) => {
          const seekTime = seekRatio * duration;
          setCurrentTime(seekTime);
          // Provide type annotation for transcriptData
          let newIndex =
            transcriptData.findIndex(
              (segment: { start: number }) => segment.start > seekTime
            ) - 1;
          // If no segment starts after the seek time, use the last segment
          if (newIndex === -2) {
            newIndex = transcriptData.length - 1;
          }
          setCurrentIndex(newIndex >= 0 ? newIndex : 0);
        }
      );
    }

    return () => {
      if (wavesurferRef.current) {
        (wavesurferRef.current as typeof WaveSurfer).un("seek");
      }
    };
  }, [wavesurferRef, duration, transcriptData]);

  const randomColor = () => {
    const random = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    return `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;
  };

  useEffect(() => {
    loopRef.current = loop; // Update the ref whenever loop state changes
  }, [loop]);

  useEffect(() => {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) {
      return;
    }
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
     

        wsRegions.on("region-updated", (region: typeof Region) => {
          console.log("Updated region", region);
        });

        let activeRegion: typeof Region | null = null;
        wsRegions.on("region-in", (region: typeof Region) => {
          console.log("region-in", region);
          activeRegion = region;
        });
        wsRegions.on("region-out", (region: typeof Region) => {
          console.log("region-out", region);
          if (activeRegion === region) {
            if (loopRef.current) {
              region.play();
            } else {
              activeRegion = null;
            }
          }
        });
        wsRegions.on(
          "region-clicked",
          (region: typeof Region, e: MouseEvent) => {
            e.stopPropagation(); // prevent triggering a click on the waveform

            activeRegion = region;
            region.play();
            region.setOptions({ color: randomColor() });
          }
        );

        wsRegions.enableDragSelection({
          color: "rgba(255, 0, 0, 0.1)",
        });

        wavesurfer.on("interaction", () => {
          activeRegion = null;
        });
      });

      wavesurfer.on("audioprocess", () => {
        const currentTime = wavesurfer.getCurrentTime();
        console.log("Current Time: ", currentTime); // Log the current time to debug
        setCurrentTime(currentTime);
      });

      wavesurferRef.current = wavesurfer;
    }

    return () => {
      if (wavesurferRef.current) {
        (wavesurferRef.current as typeof WaveSurfer).destroy();
        (wavesurferRef.current as typeof WaveSurfer).un("ready");
        (wavesurferRef.current as typeof WaveSurfer).un("audioprocess");
      }
    };
  }, [audioPath]); // Loop and isPlaying not included here because it does not affect initialization

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      (wavesurferRef.current as typeof WaveSurfer).playPause();
      setIsPlaying(!isPlaying);
    }
  };
  const handleSkip = (seconds: number) => {
    if (wavesurferRef.current) {
      (wavesurferRef.current as typeof WaveSurfer).skip(seconds);
    }
  };
  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
   
      (wavesurferRef.current as typeof WaveSurfer).setVolume(newVolume);
    
  };

  const handleSpeedChange = (speed:number) => {
    setPlaybackRate(speed);
    if (wavesurferRef.current) {
      (wavesurferRef.current as typeof WaveSurfer).setPlaybackRate(speed);
    }
  };

  const formatTime = (time: number) => {
    const rounded = Math.round(time);
    const minutes = Math.floor(rounded / 60);
    const seconds = rounded % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div>
      <div ref={waveformRef} className="waveform-container">
        <div className="waveform-time-display">
          <div className="TimerLoopRegions">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={loop}
                onChange={(e) => setLoop(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label className="font-medium text-gray-700">Loop regions</label>
            </div>
            <p style={{ color: "grey" }}>
              Click and drag on the wave to create regions
            </p>
          </div>

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="Parent">
        <div className="leftSection">
          <div className="eventControllers">
            <div className="control-group">
              <div className="flex items-center ">
                <ZoomInIcon className="h-8 w-8" />
                <input
                  type="range"
                  min="10"
                  max="1000"
                  value={zoomLevel}
                  onChange={(e) => {
                    const newZoomLevel = Number(e.target.value);
                    setZoomLevel(newZoomLevel);
                    wavesurferRef.current &&
                      (wavesurferRef.current as typeof WaveSurfer).zoom(
                        newZoomLevel
                      );
                  }}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  className="rounded-full h-12 w-12 flex items-center justify-center"
                  onClick={() => handleSkip(-5)}
                >
                  <RewindIcon className="h-10 w-10" />
                </button>
                <button
                  className="rounded-full h-12 w-12 flex items-center justify-center"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <PauseIcon className="h-10 w-10" />
                  ) : (
                    <PlayIcon className="h-10 w-10" />
                  )}
                </button>
                <button
                  className="rounded-full h-12 w-12 flex items-center justify-center"
                  onClick={() => handleSkip(5)}
                >
                  <FastForwardIcon className="h-10 w-10" />
                </button>
              </div>

              <div className="flex items-center">
            

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <PlayBackSpeedIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    style={{ width: "fit-content", background: "white" }}
                  >
                    
                    {speeds.map((speed, index) => (
                      <div
                      className="dropdown-menu-item"
                    >
                      <DropdownMenuItem
                        key={index}
                        onSelect={() => {handleSpeedChange(speed)
                          setSelectedSpeed(speed);} // Add this line
                        }
                        className="dropdown-menu-item"
                        // style={{ cursor: 'pointer' }} // Add this line
                      >
                        {speed}x{selectedSpeed === speed && <span style={{ marginLeft: '10px' }}>✓</span>}
                      </DropdownMenuItem>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center">
                <VolumeUpIcon className="h-8 w-8" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
          <section className="liveTranscription">
            <div className="innerRightSection">
              <h1>Subtitles</h1>
              <p>{transcriptText}</p>
            </div>
          </section>
        </div>

        <div className="rightSection">
          <div className="innerRightSection">
            <p>The ai suggestions placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionsComponent;
