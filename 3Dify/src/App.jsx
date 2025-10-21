import { useState } from "react";
import "./App.css";
import Message from "./Message";
import LandingPage from "./Dashboard";
import { GetToken } from "./GetToken";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div></div>
      <div>
        <LandingPage />
        <GetToken />
        <Message />
      </div>
    </>
  );
}

export default App;
