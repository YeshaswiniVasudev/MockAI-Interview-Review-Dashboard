import React, { useState, useRef, useEffect } from "react";
import "./audioPlayer.css";
import ProgressCircle from "./progressCircle";

export default function AudioPlayer({ path }: { path: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);

  const audioRef = useRef(new Audio(path));
  const intervalRef = useRef<NodeJS.Timeout | undefined>();

  const { duration } = audioRef.current;
  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        setTrackProgress(0);
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000) as NodeJS.Timeout;
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);

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
