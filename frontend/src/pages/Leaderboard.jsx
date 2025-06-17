import { useEffect, useState } from "react";
import "./Leaderboard.css";

const dummyMemes = [
  {
    id: 1,
    title: "Neon Dreams",
    image_url: "https://picsum.photos/seed/1/100",
    upvotes: 150,
    highest_bid: 3.5,
  },
  {
    id: 2,
    title: "Cyber LOLZ",
    image_url: "https://picsum.photos/seed/2/100",
    upvotes: 120,
    highest_bid: 2.8,
  },
  {
    id: 3,
    title: "Matrix Mayhem",
    image_url: "https://picsum.photos/seed/3/100",
    upvotes: 98,
    highest_bid: 1.2,
  },
  {
    id: 4,
    title: "Glitched Cat",
    image_url: "https://picsum.photos/seed/4/100",
    upvotes: 85,
    highest_bid: 4.0,
  },
  {
    id: 5,
    title: "404 Humor Not Found",
    image_url: "https://picsum.photos/seed/5/100",
    upvotes: 73,
    highest_bid: 0.9,
  },
];

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState([]);

  useEffect(() => {
    const fetchTopMemes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/leaderboard");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setTopMemes(data);
        } else {
          setTopMemes(dummyMemes);
        }
      } catch (err) {
        console.warn(err.message);
        setTopMemes(dummyMemes);
      }
    };
    const fetchTopMemesInterval = setInterval(fetchTopMemes, 1000);

    return () => clearInterval(fetchTopMemesInterval);
  }, []);

  return (
    <div className="leaderboard-container font-['VT323'] text-white px-4 py-8">
      <div className="glitch-bg-overlay" />
      <div className="scanlines" />
      <h1 className="glitch-heading text-5xl md:text-6xl text-center mb-10">
        🏆 Meme Leaderboard
      </h1>

      <div className="max-w-4xl mx-auto z-10 relative">
        <table className="w-full border-collapse border border-[#00ffff40] bg-[#0e0e0e]/70 backdrop-blur-md">
          <thead>
            <tr className="bg-[#111]/60 text-[#00ffff] text-xl border-b border-[#00ffff40]">
              <th className="p-4">#</th>
              <th className="p-4 text-left">Meme Title</th>
              <th className="p-4">Upvotes</th>
              <th className="p-4">Bid (ETH)</th>
            </tr>
          </thead>
          <tbody>
            {topMemes.map((meme, index) => (
              <tr
                key={meme.id}
                className="hover:bg-[#1a1a1a]/70 transition border-b border-[#00ffff20]"
              >
                <td className="p-4 text-center text-[#ff00ff]">{index + 1}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={meme.image_url}
                      alt={meme.title}
                      className="w-12 h-12 rounded shadow"
                    />
                    <span className="text-[#ffffff] text-lg">{meme.title}</span>
                  </div>
                </td>
                <td className="p-4 text-center text-[#39ff14] font-bold">
                  {meme.upvotes}
                </td>
                <td className="p-4 text-center text-[#00ffffaa]">
                  {meme.highest_bid}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
