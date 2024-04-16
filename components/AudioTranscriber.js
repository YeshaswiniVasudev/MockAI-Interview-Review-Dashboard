import React, { useState } from 'react';
import axios from 'axios';

function AudioToTextGenerator({ audioPath }) {
  const [transcript, setTranscript] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle audio transcription
  const handleTranscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const transResponse = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioPath }),
      });
      if (!transResponse.ok) {
        throw new Error(`HTTP error! status: ${transResponse.status}`);
      }
      const transData = await transResponse.json();
      setTranscript(transData.transcript);
      // Once transcription is successful, generate suggestions

    } catch (e) {
      setError('Failed to transcribe. Please try again later.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <button onClick={handleTranscribe} disabled={loading}>
        {loading ? 'Processing...' : 'Transcribe and Generate Suggestions'}
      </button>
      {transcript && (
        <div>
          <h3>Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
 
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AudioToTextGenerator;
