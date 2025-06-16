const express = require("express");
const router = express.Router();
const { createMeme, getAllMemes } = require("../controllers/memeController");
const { voteMeme } = require("../controllers/memeController");
const { placeBid } = require("../controllers/memeController");
const { getLeaderboard } = require("../controllers/memeController");
const { generateCaptionAndVibe } = require("../controllers/memeController");

router.post("/memes", createMeme);
router.get("/memes", getAllMemes);
router.post("/memes/:id/vote", voteMeme);
router.post("/memes/:id/bid", placeBid);
router.get("/leaderboard", getLeaderboard);
router.post("/memes/:id/caption", generateCaptionAndVibe);

module.exports = router;
