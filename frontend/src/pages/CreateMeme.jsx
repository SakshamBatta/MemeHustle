import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";

export default function CreateMeme() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [aiCaption, setAiCaption] = useState("");
  const [vibe, setVibe] = useState("");
  const [currentMeme, setCurrentMeme] = useState(null);
  const navigate = useNavigate();

  const generateCaption = () => {
    fetch(
      `https://memehustle-4ema.onrender.com/api/memes/${currentMeme.id}/caption`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setAiCaption(data.caption));
  };

  const generateVibe = () => {
    fetch(
      `https://memehustle-4ema.onrender.com/api/memes/${currentMeme.id}/vibe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setVibe(data.vibe));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title,
      image_url: imageUrl,
      tags: tags.split(",").map((t) => t.trim()),
    };

    console.log(payload);

    fetch("https://memehustle-4ema.onrender.com/api/memes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentMeme(data);
        toast.success(
          "Meme Uploaded, now generate captions and vibes using AI!"
        );
      });
  };

  return (
    <div className="min-h-screen text-white font-['VT323'] bg-[#050505] px-4 py-8 md:px-12 bg-gridLines relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-[0.03] z-0 pointer-events-none"></div>

      <div className="text-center mb-16 z-10 relative">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] via-[#ff00ff] to-[#39ff14] drop-shadow-[0_0_12px_#00ffffaa] mb-2">
          CREATE A MEME
        </h1>
        <div className="text-xl md:text-2xl text-[#00ffff] flicker h-10">
          <Typewriter
            options={{
              strings: [
                "Upload your meme...",
                "Let AI caption it...",
                "Drop it into the neon chaos.",
              ],
              autoStart: true,
              loop: true,
              delay: 40,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto z-10 relative">
        <div className="md:col-span-1 bg-[#1a1a1a]/80 p-6 rounded-xl border border-[#ff00ff88] shadow-[0_0_30px_#ff00ff55]">
          <h2 className="text-2xl text-[#ffaaff] mb-4">🗂 Upload Panel</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-3 rounded bg-[#0f0f0f] border border-[#00ffff] text-white focus:outline-none"
              placeholder="Meme Title"
              required
            />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full mb-4 p-3 rounded bg-[#0f0f0f] border border-[#00ffff] text-white focus:outline-none"
              placeholder="Image URL"
              required
            />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full mb-4 p-3 rounded bg-[#0f0f0f] border border-[#00ffff] text-white focus:outline-none"
              placeholder="Tags (comma-separated)"
              required
            />

            <button
              type="submit"
              className="w-full mt-4 px-8 py-3 bg-[#00ffff] text-black rounded-full font-bold hover:bg-[#39ff14] transition shadow-[0_0_20px_#00ffff]"
            >
              🚀 Upload to Grid
            </button>
          </form>
        </div>

        <div className="md:col-span-1 bg-[#101010cc] border-l-4 border-[#00ffcc] p-6 rounded-lg backdrop-blur-sm">
          <h2 className="text-2xl text-[#39ff14] mb-4">🧠 AI Terminal</h2>
          <p className="text-[#cccccc] text-md mb-9 italic">
            Click to feed the meme engine...
          </p>

          <button
            onClick={generateCaption}
            className="mt-7 mb-5 w-full bg-[#ff00ff] text-black px-6 py-3 font-bold rounded-full hover:bg-[#d100d1] shadow-[0_0_15px_#ff00ff] transition"
          >
            Generate AI Caption 🤖
          </button>

          <button
            onClick={generateVibe}
            className="mt-4 w-full bg-[#00ffffaa] text-black px-6 py-3 font-bold rounded-full hover:bg-[#00bbbb] shadow-[0_0_15px_#00ffff] transition"
          >
            Analyze Vibe 🔮
          </button>

          {aiCaption && <p className="mt-4 text-[#00ffff]">{aiCaption}</p>}
          {vibe && <p className="mt-2  text-[#39ff14]">{vibe}</p>}
        </div>

        <div className="md:col-span-1 border border-[#39ff1499] rounded-xl p-4 shadow-[0_0_25px_#39ff14aa] bg-[#000000cc]">
          <h2 className="text-2xl text-[#39ff14] mb-4">🔮 Hologram Preview</h2>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-64 object-cover rounded-md border border-[#ff00ff55] shadow-lg"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-[#555] border border-dashed border-[#00ffff33] rounded-md">
              Awaiting Upload...
            </div>
          )}
          <div className="mt-4 text-left text-sm">
            <p className="text-[#39ff14]">{title || "Your Meme Title"}</p>
            <p className="text-[#00ffff]">
              {aiCaption || "Awaiting AI Caption..."}
            </p>
            <p className="text-[#39ff14] italic">
              {vibe || "Vibe Analyzer Idle..."}
            </p>
            <p className="text-[#ffaaff] italic mt-1">
              {tags
                ? tags
                    .split(",")
                    .map((t) => `#${t.trim()}`)
                    .join(" ")
                : "#tags"}
            </p>
          </div>
        </div>
        {currentMeme && aiCaption && vibe && (
          <button
            onClick={() => {
              toast.success("🔥 Final Meme Ready!", {
                style: {
                  background: "#0f0f0f",
                  color: "#00ffff",
                  border: "1px solid #ff00ff",
                  boxShadow: "0 0 10px #ff00ff, 0 0 40px #00ffff",
                },
              });
              setTimeout(() => navigate("/"), 2500);
            }}
            className="mt-8 w-full bg-[#ff00ff22] text-[#00ffff] px-6 py-3 font-bold rounded-full glitch hover:bg-[#ff00ff44] transition-all shadow-[0_0_20px_#ff00ff] border border-[#00ffff] ml-110"
          >
            ✨ Finalize Meme
          </button>
        )}
      </div>
    </div>
  );
}
