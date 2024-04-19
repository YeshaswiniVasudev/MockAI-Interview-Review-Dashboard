// Import necessary modules and components
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RegionsComponent from "@/components/RegionsComponent";
import "./style.css";
import { HomeIcon } from "@heroicons/react/solid";

// Define the type for the audio data
interface Audio {
  title: string; // Title of the audio file
  path: string; // Path to the audio file
  transcript: string; // Path to the transcript of the audio file
}

// Define the AudioPage component
const AudioPage = () => {
  // Use the useRouter hook to access the router
  const router = useRouter();
  // Extract the id from the router query
  const { id } = router.query;
  // Define a state variable for the audio data
  const [audio, setAudio] = useState<Audio | null>(null);

  // Fetch the audio data when the id changes
  useEffect(() => {
    const idStr = id && typeof id === "object" ? id[0] : id;
    if (idStr) {
      fetch(`/api/detailedPage/${idStr}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched data:", data);
          // Set the audio data state
          setAudio(data);
        });
    }
  }, [id]);

  // If the audio data is not yet loaded, render a loading message
  if (!audio) {
    return <div>Loading...</div>;
  }

  // Render the AudioPage component
  return (
    <>
      <section className="container">
        <div className="AudioTitle space-x-4">
          <HomeIcon className="h-8 w-8 cursor-pointer hover:text-blue-500 transition-colors duration-200" onClick={() => router.push('/')}/>
          <h1>{audio.title}</h1>
        </div>
        <div className="regionsComponent">
          <RegionsComponent audioPath={audio.path} transcriptPath={audio.transcript}/>
        </div>
        <br />
        <br />
      </section>
    </>
  );
};

// Export the AudioPage component
export default AudioPage;