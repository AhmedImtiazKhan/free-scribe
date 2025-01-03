import React from "react";

export default function Information() {
  return (
    <main className="flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 w-full max-w-prose mx-auto">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap">
        Your <span className="text-blue-400 bold">Transcription</span>
      </h1>
      <div className="flex items-center gap-2">
        <buttpn>Transcription</buttpn>
        <buttpn>Translation</buttpn>
      </div>
    </main>
  );
}
