import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import WaveSurferComponent from '@/components/waveSurferComponent';
import RegionsComponent from "@/components/RegionsComponent";
import AudioTranscriber from "@/components/AudioTranscriber";
import "./style.css";
import { HomeIcon } from "@heroicons/react/solid";

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
    const idStr = id && typeof id === "object" ? id[0] : id;
    if (idStr) {
      fetch(`/api/detailedPage/${idStr}`)
        .then((response) => response.json())

        .then((data) => {
          console.log("Fetched data:", data);
          setAudio(data);
        });
    }
  }, [id]);

  if (!audio) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="container">
        <div className="AudioTitle space-x-4">
          <HomeIcon className="h-8 w-8 cursor-pointer hover:text-blue-500 transition-colors duration-200" onClick={() => router.push('/')}/>
          <h1>{audio.title}</h1>
        </div>
        <div className="regionsComponent">
          <RegionsComponent audioPath={audio.path} />
        </div>

        <br />
        <br />
      </section>
    </>
  );
};

export default AudioPage;
