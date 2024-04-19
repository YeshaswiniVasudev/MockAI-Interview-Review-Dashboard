// Import necessary modules and components
import React from "react";
import "./progressCircle.css";
import { PlayIcon, PauseIcon } from "@heroicons/react/solid";

// Define the props for the Circle component
interface CircleProps {
  percentage: number; // The percentage of the circle to fill
  size: number; // The size of the circle
  strokeWidth: number; // The width of the circle's stroke
}

// Define the Circle component
const Circle: React.FC<CircleProps> = ({ percentage, size, strokeWidth }) => {
  // Calculate the radius and circumference of the circle
  const radius = size / 2 - strokeWidth * 2;
  const circ = 2 * Math.PI * radius;
  // Calculate the length of the stroke to fill
  const strokePct = ((100 - percentage) * circ) / 100;

  // Render the Circle component
  return (
    <svg width={size} height={size}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#12c2e9" />
          <stop offset="50%" stopColor="#c471ed" />
          <stop offset="100%" stopColor="#f64f59" />
        </linearGradient>
      </defs>
      <circle
        r={radius}
        cx="50%"
        cy="50%"
        fill="transparent"
        stroke="url(#gradient)"
        strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={isNaN(strokePct) ? 0 : strokePct}
        strokeLinecap="round"
      />
    </svg>
  );
};

// Define the CircleProgress component
const CircleProgress: React.FC<CircleProps> = ({
  percentage,
  size,
  strokeWidth,
}) => {
  // Calculate the radius and circumference of the circle
  const radius = size / 2 - strokeWidth * 2;
  const circ = 2 * Math.PI * radius;
  // Calculate the length of the stroke to fill
  const strokePct = ((100 - percentage) * circ) / 100;

  // Render the CircleProgress component
  return (
    <svg width={size} height={size}>
      <circle
        r={radius}
        cx="50%"
        cy="50%"
        fill="transparent"
        stroke="black"
        strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={isNaN(strokePct) ? 0 : strokePct}
        strokeLinecap="round"
      />
    </svg>
  );
};

// Define the props for the ProgressCircle component
interface ProgressCircleProps {
  children?: React.ReactNode; // The child components to render inside the circle
  percentage: number; // The percentage of the circle to fill
  size: number; // The size of the circle
  isPlaying: boolean; // Whether the circle is playing
  color: string; // The color of the circle
  onTogglePlay: () => void; // The function to call when the circle is clicked
}

// Define the ProgressCircle component
const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  isPlaying,
  size,
  color,
  onTogglePlay,
}) => {
  // Render the ProgressCircle component
  return (
    <div
      className="progress-circle flex relative cursor-pointer"
      style={{ width: size, height: size }}
      onClick={onTogglePlay}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#12c2e9" />
            <stop offset="50%" stopColor="#c471ed" />
            <stop offset="100%" stopColor="#f64f59" />
          </linearGradient>
        </defs>
        <g>
          <Circle strokeWidth={4} size={size} percentage={100} />
          <CircleProgress strokeWidth={4} percentage={percentage} size={size} />
        </g>
      </svg>
      {isPlaying ? (
        <PauseIcon
          style={{ width: "32px", height: "32px" }}
          className="icon-fill absolute inset-0 m-auto"
        />
      ) : (
        <PlayIcon
          style={{ width: "32px", height: "32px" }}
          className="icon-fill absolute inset-0 m-auto"
        />
      )}
    </div>
  );
};

// Export the ProgressCircle component
export default ProgressCircle;
