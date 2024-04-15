import React from "react";
import "./progressCircle.css";
import { PlayIcon, PauseIcon } from '@heroicons/react/solid';

const Circle = ({ color, percentage, size, strokeWidth }) => {
  const radius = size / 2 - strokeWidth * 2;
  const circ = 2 * Math.PI * radius;
  const strokePct = ((100 - percentage) * circ) / 100;

  return (
    <circle
      r={radius}
      cx="50%"
      cy="50%"
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={circ}
      strokeDashoffset={strokePct}
      strokeLinecap="round"
    />
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
        <g>
          <Circle strokeWidth={4} color="#3B4F73" size={size} />
          <Circle strokeWidth={4} color={color} percentage={percentage} size={size} />
        </g>
      </svg>
      {isPlaying ?
    <PauseIcon style={{ width: '32px', height: '32px' }} className="icon-fill absolute inset-0 m-auto"/> :
    <PlayIcon style={{ width: '32px', height: '32px' }} className="icon-fill absolute inset-0 m-auto"/>
}
    </div>
  );
}
