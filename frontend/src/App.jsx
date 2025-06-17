import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CreateMeme from "./pages/CreateMeme";
import Leaderboard from "./pages/Leaderboard";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateMeme />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
