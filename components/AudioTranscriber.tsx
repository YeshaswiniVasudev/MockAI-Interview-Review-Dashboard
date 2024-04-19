// Import necessary modules and components
import React, { useState } from "react";

// Define the AudioToTextGenerator component
function AudioToTextGenerator({ audioPath }: { audioPath: string }) {
  // Define state variables for the transcript, error message, and loading state
  const [transcript, setTranscript] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Define a function to handle the transcription
  const handleTranscribe = async () => {
    setLoading(true);
    // Clear the error message
    setError("");
    try {
      // Send a POST request to the /api/transcribe endpoint with the audio path
      const transResponse = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioPath }),
      });
      // If the response is not OK, throw an error
      if (!transResponse.ok) {
        throw new Error(`HTTP error! status: ${transResponse.status}`);
      }
      // Parse the response data as JSON
      const transData = await transResponse.json();
      // Set the transcript state to the transcript from the response data
      setTranscript(transData.transcript);
    } catch (e) {
      // If an error occurs, set the error message and log the error
      setError("Failed to transcribe. Please try again later.");
      console.error(e);
    } finally {
      // Set the loading state to false
      setLoading(false);
    }
  };

  // Render the component
  return (
    <div>
      {/* Render a button that triggers the handleTranscribe function when clicked */}
      <button onClick={handleTranscribe} disabled={loading}>
        {loading ? "Processing..." : "Transcribe and Generate Suggestions"}
      </button>
      {/* Render the transcript if it exists */}
      {transcript && (
        <div>
          <h3>Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
      {/* Render the error message if it exists */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
// Export the AudioToTextGenerator component
export default AudioToTextGenerator;
