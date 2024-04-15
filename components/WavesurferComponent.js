import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import './WaveSurferComponent.css';

const WaveSurferComponent = ({ audioUrl }) => {
    const waveformRef = useRef(null);
    const ws = useRef(null);
    const [volume, setVolume] = useState(1); // Default volume is set to 100%
    const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level

    useEffect(() => {
        ws.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            cursorWidth: 2,
            cursorColor: 'white',
            plugins: [
                RegionsPlugin.create()
            ],
            minPxPerSec: 100,
  dragToSeek: true,
        });

        ws.current.load(audioUrl);

        // Set initial volume
        ws.current.setVolume(volume);

        ws.current.once('decode', () => {
            const slider = document.querySelector('input[type="range"]')
          
            slider.addEventListener('input', (e) => {
              const minPxPerSec = e.target.valueAsNumber
              ws.current.zoom(minPxPerSec)
            })
          })

          

        // Cleanup function to destroy WaveSurfer instance when component unmounts
        return () => {
            if (ws.current) {
                ws.current.destroy();
            }
        };
    }, [audioUrl]); // Effect runs only when `audioUrl` changes

    // Handle play/pause
    const handlePlayPause = () => {
        ws.current.playPause();
    };

    // Handle volume change
    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        ws.current.setVolume(newVolume);
    };
    const handleZoomChange = (event) => {
        const newZoomLevel = parseInt(event.target.value, 10);
        setZoomLevel(newZoomLevel);
        if (ws.current.isReady) {
          ws.current.zoom(newZoomLevel);
        }
      };

    return (
        <div>
            <div ref={waveformRef} className='waveform-container'></div>
            <input type="range" min="1" max="100" step="1" value={zoomLevel} onChange={handleZoomChange} />
            <button onClick={handlePlayPause}>Play/Pause</button>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
        </div>
    );
};

export default WaveSurferComponent;
