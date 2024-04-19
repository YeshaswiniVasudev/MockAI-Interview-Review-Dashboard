//Import necessary modules and components
import React, { useState, useRef, useEffect } from "react";
import ProgressCircle from "./progressCircle";

// Define the AudioPlayer component
export default function AudioPlayer({ path }: { path: string }) {
  // Define state variables for the playing state and the track progress
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);

  // Define refs for the audio element and the interval
  const audioRef = useRef(new Audio(path));
  const intervalRef = useRef<NodeJS.Timeout | undefined>();
  // Calculate the current percentage of the audio that has been played
  const { duration } = audioRef.current;
  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

  // Define a function to start the timer that updates the track progress
  const startTimer = () => {
    // Clear the previous interval
    clearInterval(intervalRef.current);
    // Start a new interval that updates the track progress every second
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        // If the audio has ended, reset the track progress and start the audio again
        setTrackProgress(0);
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        // If the audio is still playing, update the track progress
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000) as NodeJS.Timeout;
  };

  // Use an effect to play or pause the audio when the playing state changes
  useEffect(() => {
    if (isPlaying) {
      // If the audio should be playing, start the audio and the timer
      audioRef.current.play();
      startTimer();
    } else {
      // If the audio should be paused, pause the audio and clear the timer
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Use an effect to clean up when the component unmounts
  useEffect(() => {
    return () => {
      // Pause the audio and clear the timer
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  // Define a function to toggle the playing state
  const togglePlay = () => setIsPlaying(!isPlaying);

  // Render the audio player
  return (
    <div className="player-body flex">
      <div className="player-left-body">
        <ProgressCircle
          percentage={currentPercentage}
          isPlaying={isPlaying}
          size={50}
          color="#C96850"
          onTogglePlay={togglePlay}
        >
          {/* Button as a child, styled and positioned over the circle */}
          <button
            onClick={togglePlay}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </ProgressCircle>
      </div>
    </div>
  );
}
