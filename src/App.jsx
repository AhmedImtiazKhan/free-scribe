import { useState, useEffect } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import FileDisplay from "./components/FileDisplay";
import Information from "./components/Information";
import Transcribing from "./components/Transcribing";

function App() {
  const [count, setCount] = useState(0);
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(true);
  const [loading, setLoading] = useState(true);

  const isAudioAvailable = file || audioStream;
  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  useEffect(() => {
    console.log(audioStream);
  }, [audioStream]);

  return (
    <>
      <div className="flex flex-col p-4 max-w-[1000px] mx-auto w-full">
        <section className="min-h-screen flex flex-col">
          <Header />
          {output ? <Information /> : loading ? <Transcribing /> : <></>}
          {isAudioAvailable ? (
            <FileDisplay
              handleAudioReset={handleAudioReset}
              file={file}
              audioStream={setAudioStream}
            />
          ) : (
            <HomePage setFile={setFile} setAudioStream={setAudioStream} />
          )}
        </section>
        <h1 className="text-green-400">Hello</h1>
        <footer></footer>
      </div>
    </>
  );
}

export default App;
