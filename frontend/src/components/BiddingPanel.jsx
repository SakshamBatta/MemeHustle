export default function BiddingPanel({ meme, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-[#ff00ff] shadow-[0_0_20px_#ff00ff] p-6 rounded-xl w-[90%] max-w-md text-center">
        <h2
          className="text-3xl text-[#ff00ff] mb-4 glitch"
          data-text="Place Your Bid"
        >
          Place Your Bid
        </h2>
        <p className="text-white mb-2">
          On meme: <span className="text-[#00ffff]">{meme.title}</span>
        </p>
        <button className="mt-6 px-6 py-2 bg-[#00ffff] text-black rounded-full shadow-[0_0_20px_#00ffff] hover:bg-[#39ff14] transition">
          Upvote Meme
        </button>
        <button
          className="block mx-auto mt-4 text-sm text-[#999]"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
