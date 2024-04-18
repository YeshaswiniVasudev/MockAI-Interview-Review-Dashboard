import React from "react";
import "./progressCircle.css";
import { PlayIcon, PauseIcon } from '@heroicons/react/solid';

const Circle = ({ percentage, size, strokeWidth }) => {
  const radius = size / 2 - strokeWidth * 2;
  const circ = 2 * Math.PI * radius;
  const strokePct = ((100 - percentage) * circ) / 100;

  return (
    // <circle
    //   r={radius}
    //   cx="50%"
    //   cy="50%"
    //   fill="transparent"
    //   stroke={color}
    //   strokeWidth={strokeWidth}
    //   strokeDasharray={circ}
    //   strokeDashoffset={isNaN(strokePct) ? 0 : strokePct}
    //   strokeLinecap="round"
    // />
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

const CircleProgress = ({ percentage, size, strokeWidth }) => {
  const radius = size / 2 - strokeWidth * 2;
  const circ = 2 * Math.PI * radius;
  const strokePct = ((100 - percentage) * circ) / 100;

  return (
    // <circle
    //   r={radius}
    //   cx="50%"
    //   cy="50%"
    //   fill="transparent"
    //   stroke={color}
    //   strokeWidth={strokeWidth}
    //   strokeDasharray={circ}
    //   strokeDashoffset={isNaN(strokePct) ? 0 : strokePct}
    //   strokeLinecap="round"
    // />
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

export default function ProgressCircle({
  percentage,
  isPlaying,
  size,
  color,
  onTogglePlay,
}) {
  return (
    <div className="progress-circle flex relative cursor-pointer" style={{ width: size, height: size }} onClick={onTogglePlay}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#12c2e9" />
          <stop offset="50%" stopColor="#c471ed" />
          <stop offset="100%" stopColor="#f64f59" />
        </linearGradient>
      </defs>
        <g>
          <Circle strokeWidth={4}  size={size} />
          <CircleProgress strokeWidth={4} percentage={percentage} size={size} />
        </g>
      </svg>
      {isPlaying ?
    <PauseIcon style={{ width: '32px', height: '32px' }} className="icon-fill absolute inset-0 m-auto"/> :
    <PlayIcon style={{ width: '32px', height: '32px' }} className="icon-fill absolute inset-0 m-auto"/>
}
    </div>
  );
}
