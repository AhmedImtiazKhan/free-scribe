import React, { useState, useEffect, useRef } from "react";

export default function HomePage(props) {
  const { setFile, setAudioStream } = props;
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [duration, setDuration] = useState(0);
  const mimeType = "audio/webm";
  const mediaRecorder = useRef(null);

  async function startRecording() {
    let tempStream;

    console.log("Start recording");

    try {
      // Access audio stream
      tempStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (e) {
      console.log(e);
      return;
    }

    // Initialize MediaRecorder
    const media = new MediaRecorder(tempStream, { type: mimeType });
    mediaRecorder.current = media;
    setRecordingStatus("recording");
    let localAudioChunks = [];

    mediaRecorder.current.ondataavailable = (e) => {
      if (typeof e.data === "undefined" || e.data.size === 0) {
        return;
      }
      localAudioChunks.push(e.data);
      setAudioChunks(localAudioChunks);
    };

    mediaRecorder.current.start();
  }

  function stopRecording() {
    setRecordingStatus("inactive");
    console.log("Stop recording");

    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioStream(audioBlob);
      setAudioChunks([]);
      console.log("Recording complete:", audioUrl);
    };
  }

  useEffect(() => {
    if (recordingStatus === "inactive") {
      return;
    }
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [recordingStatus]);

  return (
    <main className="flex-1 p-4 flex flex-col gap-3 sm:gap-4 justify-center text-center pb-20">
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">
        Free<span className="text-blue-400 bold">Scribe</span>
      </h1>
      <h3 className="font-medium md:text-lg">
        Record<span className="text-blue-400 ">&rarr;</span>Transcribe
        <span className="text-blue-400 ">&rarr;</span>Translate
      </h3>
      <button
        onClick={
          recordingStatus === "inactive" ? startRecording : stopRecording
        }
        className="flex specialBtn px-4 py-2 rounded-xl items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4"
      >
        <p className="text-blue-400">
          {recordingStatus === "inactive" ? "Record" : "Stop recording"}
        </p>
        <div className="flex items-center gap-2">
          {duration !== 0 && <p className="text-xs">{duration}s</p>}
        </div>
        <i className="fa-solid fa-microphone"></i>
      </button>
      <p className="text-base">
        Or{"  "}
        <label className="text-blue-400 cursor-pointer hover:text-blue-600 duration-200">
          Upload{" "}
          <input
            onChange={(e) => {
              const tempFile = e.target.files[0];
              setFile(tempFile);
            }}
            className="hidden"
            type="file"
            accept=".mp3,.wav"
          />{" "}
          a mp3 file
        </label>
        <p className="italic text-slate-400">Free now free forever</p>
      </p>
    </main>
  );
}
