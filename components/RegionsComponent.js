import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import './WaveSurferComponent.css';


const RegionsComponent = ({ audioPath }) => {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const loopRef = useRef(true);  // Use a ref to hold the loop state
    const [isPlaying, setIsPlaying] = useState(false);
    const [loop, setLoop] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(10);
    const [volume, setVolume] = useState(1);

  const randomColor = () => {
    const random = (min, max) => Math.random() * (max - min) + min;
    return `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;
  };

  useEffect(() => {
    loopRef.current = loop;  // Update the ref whenever loop state changes
  }, [loop]);

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'violet',
        progressColor: 'purple',
        url: audioPath,
      });

      wavesurfer.setVolume(volume);

      const wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());

      wavesurfer.on('ready', () => {
        console.log('WaveSurfer is ready');
        const region = wsRegions.addRegion({
          start: 0,
          end: 10,
          color: randomColor(),
          drag: false,
          resize: true,
        });

        // Ensure looping is handled correctly
        // region.on('out', () => {
        //   if (loop && isPlaying) {
        //     wavesurfer.play(region.start);
        //   }
        // });

        wsRegions.on('region-updated', (region) => {
            console.log('Updated region', region)
          })


          let activeRegion = null
          wsRegions.on('region-in', (region) => {
            console.log('region-in', region)
            activeRegion = region
          })
          wsRegions.on('region-out', (region) => {
            console.log('region-out', region)
            if (activeRegion === region) {
              if (loopRef.current) {
                region.play()
              } else {
                activeRegion = null
              }
            }
          })
          wsRegions.on('region-clicked', (region, e) => {
            e.stopPropagation() // prevent triggering a click on the waveform
            
            activeRegion = region
            region.play()
            region.setOptions({ color: randomColor() })
          })

        wsRegions.enableDragSelection({
            color: 'rgba(255, 0, 0, 0.1)',
          })

          wavesurfer.on('interaction', () => {
            activeRegion = null
          })
      });

      wavesurferRef.current = wavesurfer;
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audioPath]); // Loop and isPlaying not included here because it does not affect initialization

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    wavesurferRef.current.setVolume(newVolume);
};

  return (
    <div>
      <div ref={waveformRef} className='waveform-container'></div>
      <button onClick={handlePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <div>
        <label>
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
          />
          Loop regions
        </label>
        <label style={{ marginLeft: '2em' }}>
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

        <label style={{ marginLeft: '2em' }}>
          Volume:
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
        </label>
      </div>
     
    </div>
  );
};

export default RegionsComponent;