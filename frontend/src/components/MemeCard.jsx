import { useState } from "react";

export default function MemeCard({ meme }) {
  const [bidAmount, setBidAmount] = useState("");
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  const handleBid = () => {
    if (!bidAmount) return alert("Enter a bid!");
    console.log(`Bid ${bidAmount} ETH on ${meme.title}`);
    setBidAmount("");
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#00ffff] shadow-[0_0_15px_#00ffff] hover:scale-105 transition-all duration-300">
      <img
        src={meme.image_url}
        alt={meme.title}
        className="rounded-md mb-4 border border-[#00ffff] shadow-[0_0_10px_#00ffff]"
      />
      <h3 className="text-xl text-white mb-2 glitch" data-text={meme.title}>
        {meme.title}
      </h3>
      <p className="text-pink-400 flicker mb-2">
        💰 Highest Bid: {meme.highest_bid} ETH
      </p>

      <div className="flex flex-wrap gap-2 text-sm text-[#00ffff] mb-3">
        {meme.tags.map((tag, i) => (
          <span key={i}>#{tag}</span>
        ))}
      </div>

      <div className="flex gap-4 items-center mb-4">
        <button
          onClick={() => setUpvotes(upvotes + 1)}
          className="text-green-400 hover:text-green-300 transition"
        >
          🔼 {upvotes}
        </button>
        <button
          onClick={() => setDownvotes(downvotes + 1)}
          className="text-red-400 hover:text-red-300 transition"
        >
          🔽 {downvotes}
        </button>
      </div>

      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder="Enter your bid (ETH)"
        className="w-full p-2 mb-2 bg-[#0f0f0f] text-white border border-[#ff00ff] rounded-md focus:outline-none"
      />
      <button
        onClick={handleBid}
        className="w-full px-4 py-2 bg-[#00ffff] hover:bg-[#39ff14] text-black rounded-full font-bold transition shadow-[0_0_10px_#00ffff]"
      >
        Place Bid
      </button>
    </div>
  );
}
