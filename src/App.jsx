import { useState } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex flex-col p-4 max-w-[1000px] mx-auto w-full">
        <section className="min-h-screen flex flex-col">
          <Header />
          <HomePage />
        </section>
        <h1 className="text-green-400">Hello</h1>
        <footer></footer>
      </div>
    </>
  );
}

export default App;
