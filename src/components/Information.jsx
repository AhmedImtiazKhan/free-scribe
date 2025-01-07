import React from "react";
import { useState } from "react";

export default function Information() {
  const [tab, setTab] = useState("transcription");
  return (
    <main className="flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 w-full max-w-prose mx-auto">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap">
        Your <span className="text-blue-400 bold">Transcription</span>
      </h1>
      <div className="flex mx-auto bg-white border-2 border-solid border-blue shadow rounded-full overflow-hidden items-center items-center gap-2">
        <buttpn
          className={
            "px-4 py-1 font-medium" +
            (tab === "transcription"
              ? " bg-blue-400 text-white"
              : " text-blue-400 hover:text-blue-600")
          }
        >
          Transcription
        </buttpn>
        <buttpn className="px-4 py-1 font-medium">Translation</buttpn>
      </div>
    </main>
  );
}
