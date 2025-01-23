import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import FileDisplay from "./components/FileDisplay";
import Information from "./components/Information";
import Transcribing from "./components/Transcriping";
import { use } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(true);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [DOWNLOADING, setDOWNLOADING] = useState(false);

  const isAudioAvailable = file || audioStream;
  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  const worker = useRef(null);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("./utils/worker.js", import.meta.url),
        { type: "module" }
      );
    }
    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case "DOWNLOADING":
          setDOWNLOADING(true);
          console.log("DOWNLOADING");
          break;
        case "LOADING":
          setLoading(true);
          console.log("LOADING");
          break;
        case "RESULT":
          setOutput(e.data.payload);
          console.log("RESULT");
          break;
        case "INFERENCE_DONE":
          setFinished(true);
          console.log("INFERENCE_DONE");
          break;
      }
    };
    worker.current.addEventListener("message", onMessageReceived);
    onMessageReceived({ data: { type: "LOADING" } });
    return () => {
      worker.current.removeEventListener("message", onMessageReceived);
    };
  }, []);

  async function readAudioFile(file) {
    const sampling_rate = 16000;
    const audioCTX = new AudioContext({ sampleRate: sampling_rate });
    const response = await file.arrayBuffer();
    const decoded = await audioCTX.decodeAudioData(response);
    const audio = decoded.getChannelData(0);
    return audio;
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) {
      return;
    }
    let audio = await readAudioFile(file ? file : audioStream);
    const model_name = "openai/whisper-tiny.en";

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
      model_name,
    });
  }
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
