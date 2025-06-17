const express = require("express");
const router = express.Router();
const {
  createMeme,
  getAllMemes,
  generateCaption,
  generateVibe,
  getHighestBid,
} = require("../controllers/memeController");
const { voteMeme } = require("../controllers/memeController");
const { placeBid } = require("../controllers/memeController");
const { getLeaderboard } = require("../controllers/memeController");

router.post("/memes", createMeme);
router.get("/memes", getAllMemes);
router.post("/memes/:id/vote", voteMeme);
router.post("/memes/:id/bid", placeBid);
router.get("/leaderboard", getLeaderboard);
router.post("/memes/:id/caption", generateCaption);
router.post("/memes/:id/vibe", generateVibe);
router.get("/memes/:id/highest-bid", getHighestBid);

module.exports = router;
