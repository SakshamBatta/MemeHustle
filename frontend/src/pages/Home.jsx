import { useState } from "react";
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

const dummyMemes = [
  {
    id: 1,
    title: "Glitched Reality",
    image_url: "https://picsum.photos/300?random=1",
    tags: ["ai", "glitch", "cyberpunk"],
    highest_bid: 3.2,
    bidder: "NeoMatrix",
    vibe: "💀 Glitchcore Chaos",
  },
  {
    id: 2,
    title: "Neon Brainwave",
    image_url: "https://picsum.photos/300?random=2",
    tags: ["hacker", "funny", "neon"],
    highest_bid: 2.5,
    bidder: "CyberDuck",
    vibe: "🌐 Neon Surge",
  },
  {
    id: 3,
    title: "Matrix LOL",
    image_url: "https://picsum.photos/300?random=3",
    tags: ["matrix", "humor", "digital"],
    highest_bid: 4.1,
    bidder: "HackJoker",
    vibe: "🎭 Digital Dystopia",
  },
];

export default function Home() {
  const [bids, setBids] = useState({});
  const [votes, setVotes] = useState({});

  const [memes, setMemes] = useState([]);

  const handleBidChange = (id, value) => {
    setBids((prev) => ({ ...prev, [id]: value }));
  };

  const handleVote = (id, type) => {
    setVotes((prev) => {
      const prevUp = prev[id]?.up || 0;

      return {
        ...prev,
        [id]: {
          up: type === "up" ? prevUp + 1 : Math.max(prevUp - 1, 0),
        },
      };
    });

    try {
      fetch(`http://localhost:3000/api/memes/${id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      }).then(() => {
        toast.success(`Meme upvotes now at ${votes[id].up + 1}`);
      });
    } catch (err) {
      console.warn(err.message);
    }
  };

  const handlePlaceBid = (id) => {
    const credits = bids[id];

    try {
      fetch(`http://localhost:3000/api/memes/${id}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credits }),
      }).then(() => {
        if (credits && !isNaN(credits)) {
          toast.success(`Bid of ${credits} ETH placed on meme by CyberPunk`);
        }
      });
    } catch (err) {
      console.warn(err.message);
    }
  };

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/memes");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setMemes(data);
          const initialVotes = {};
          data.forEach((meme) => {
            initialVotes[meme.id] = { up: meme.upvotes || 0 };
          });
          setVotes(initialVotes);
        } else {
          setMemes(dummyMemes);
        }
      } catch (err) {
        console.warn(err.message);
        setMemes(dummyMemes);
      }
    };

    const fetchMemesInterval = setInterval(fetchMemes, 1000);

    return () => clearInterval(fetchMemesInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['VT323'] px-4 py-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-[0.04] z-0 pointer-events-none"></div>

      <nav className="w-full py-4 px-6 md:px-10 lg:px-16 flex justify-between items-center relative z-10 border-b border-[#00ffff40] backdrop-blur-md bg-[#050505]/60 shadow-[0_0_20px_#00ffff33]">
        <Link
          to="/"
          className="text-4xl text-[#00ffff] futuristic-glitch tracking-wider neon-border px-4 py-1 rounded-lg shadow-[0_0_15px_#00ffff99]"
        >
          MemeHustle
        </Link>

        <ul className="flex gap-8 text-lg md:text-xl items-center text-white">
          <li className="nav-item">
            <Link to="/create" className="relative group text-[#00ffee]">
              🚀 Create Meme
              <span className="nav-underline" />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/leaderboard" className="relative group text-[#ff66ff]">
              🏆 Leaderboard
              <span className="nav-underline" />
            </Link>
          </li>
        </ul>
      </nav>

      <section className="text-center py-10 z-10 relative">
        <div className="text-xl md:text-2xl text-[#ffaaff] flicker h-8">
          <Typewriter
            options={{
              strings: [
                "Generating Memes...",
                "Injecting Neon...",
                "Uploading to the Grid...",
              ],
              autoStart: true,
              loop: true,
              delay: 40,
            }}
          />
        </div>
      </section>

      <section className="text-center py-6">
        <h2 className="text-6xl sm:text-7xl md:text-8xl font-bold futuristic-glitch neon-text">
          ⚔️ Meme Marketplace
        </h2>
      </section>

      <section className="py-10 z-10 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {memes.map((meme) => (
            <div
              key={meme.id}
              className="bg-[#1a1a2e]/80 border border-[#00ffff30] shadow-[0_0_20px_#00ffff55] rounded-lg p-4 transition-all hover:scale-[1.02]"
            >
              <img
                src={meme.image_url}
                alt={meme.title}
                className="w-full h-60 object-cover rounded mb-3"
              />
              <h3 className="text-2xl font-semibold text-[#00ffff] mb-2 border-b border-[#00ffff40] pb-1 futuristic-glitch">
                {meme.title}
              </h3>
              <p className="text-sm text-[#ffffffaa] italic mb-2">
                📝 Caption:{" "}
                <span className="text-[#ffaaee]">{meme.caption}</span>
              </p>

              <p className="text-sm text-[#ff00ffaa] mb-1">
                Tags: {meme.tags.join(", ")}
              </p>

              <p className="text-sm text-[#00ffaa] italic mt-1">
                Vibe: <span className="text-[#39ff14]">{meme.vibe}</span>
              </p>

              <p className="text-md text-[#39ff14] mt-2">
                💰 Highest Bid:{" "}
                <span className="text-[#00ffff]">{meme.highest_bid}</span>
              </p>
              <p className="text-sm text-[#ffaaffbb] -mt-1">
                Bidder: <span className="italic">{meme.bidder}</span>
              </p>

              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVote(meme.id, "up")}
                    className="bg-[#00ffff20] border border-[#00ffff] px-2 py-1 rounded hover:bg-[#00ffff40] transition text-[#00ffff] shadow-[0_0_10px_#00ffff]"
                  >
                    🔼 {votes[meme.id]?.up ?? meme.upvotes}
                  </button>
                  <button
                    onClick={() => handleVote(meme.id, "down")}
                    className="bg-[#ff00ff20] border border-[#ff00ff] px-2 py-1 rounded hover:bg-[#ff00ff40] transition text-[#ff00ff] shadow-[0_0_10px_#ff00ff]"
                  >
                    🔽
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="number"
                  placeholder="Your Bid (ETH)"
                  value={bids[meme.id] || ""}
                  onChange={(e) => handleBidChange(meme.id, e.target.value)}
                  className="flex-1 px-3 py-1 bg-[#050510] border border-[#00ffff50] rounded text-white placeholder:text-[#888]"
                />
                <button
                  onClick={() => handlePlaceBid(meme.id)}
                  className="bg-[#00ffff30] border border-[#00ffff90] text-[#00ffff] px-3 py-1 rounded hover:bg-[#00ffff50] transition shadow-[0_0_12px_#00ffff]"
                >
                  Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
