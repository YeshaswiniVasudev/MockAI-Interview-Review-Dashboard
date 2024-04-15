import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import WaveSurferComponent from '@/components/waveSurferComponent';
import RegionsComponent from '@/components/RegionsComponent';

interface Audio {
  title: string;
path: string;
}

const AudioPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [audio, setAudio] = useState<Audio | null>(null);

  useEffect(() => {
    // Convert id to a string and check if it's defined
    const idStr = id && typeof id === 'object' ? id[0] : id;
    if (idStr) {
     
      fetch(`/api/detailedPage/${idStr}`)
        .then(response => response.json())
        
        .then(data => {
          console.log("Fetched data:", data);
          setAudio(data)});
    }
  }, [id]);

  if (!audio) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>{audio.title}</h1>
      {/* <audio controls>
        
        <source src={audio.audio_file} type="audio/wav" />
        Your browser does not support the audio element.
      </audio> */}
                 
      <WaveSurferComponent audioUrl={audio.path} />
      <RegionsComponent audioPath={audio.path} />
    </div>
  );
};

export default AudioPage;

