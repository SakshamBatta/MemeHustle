const supabase = require("../services/supabaseClient");
const axios = require("axios");

exports.createMeme = async (req, res) => {
  try {
    const { title, image_url, tags } = req.body;

    if (!title || !Array.isArray(tags)) {
      return res
        .status(400)
        .json({ error: "Missing required fields or tags not an array" });
    }
    const defaultImage = "https://picsum.photos/200";
    const imageUrl =
      !image_url || image_url.trim() === "" ? defaultImage : image_url;

    const { data, error } = await supabase
      .from("memes")
      .insert([
        {
          title,
          image_url: imageUrl,
          tags,
          upvotes: 0,
          owner_id: "cyberpung420",
        },
      ])
      .select();

    if (error) return res.status(400).json({ error });

    res.status(201).json(data[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllMemes = async (req, res) => {
  try {
    const { data: memes, error: memeError } = await supabase
      .from("memes")
      .select("*")
      .order("created_at", { ascending: false });

    if (memeError) return res.status(400).json({ error: memeError.message });

    const memeWithBids = await Promise.all(
      memes.map(async (meme) => {
        const { data: bidData, error: bidError } = await supabase
          .from("bids")
          .select("credits")
          .eq("meme_id", meme.id)
          .order("credits", { ascending: false })
          .limit(1)
          .single();

        return {
          ...meme,
          highest_bid: bidData?.credits || 0,
          bidder: "CyberPunk",
        };
      })
    );

    res.status(200).json(memeWithBids);
  } catch (err) {
    console.error("Error fetching memes with bids:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.voteMeme = async (req, res) => {
  try {
    const memeId = req.params.id;
    const { type } = req.body;

    if (!["up", "down"].includes(type)) {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    const increment = type === "up" ? 1 : -1;

    const { data: meme, error: fetchError } = await supabase
      .from("memes")
      .select("upvotes")
      .eq("id", memeId)
      .single();

    if (fetchError || !meme)
      return res.status(404).json({ error: "Meme not found" });

    const newUpvotes = meme.upvotes + increment;

    const { data, error } = await supabase
      .from("memes")
      .update({ upvotes: newUpvotes })
      .eq("id", memeId)
      .select()
      .single();

    if (error) return res.status(400).json({ error });

    res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.placeBid = async (req, res) => {
  try {
    const memeId = req.params.id;
    const { credits } = req.body;

    const { data, error } = await supabase
      .from("bids")
      .insert([
        {
          meme_id: memeId,
          user_id: "cyberpunk420",
          credits,
        },
      ])
      .select();

    if (error) return res.status(400).json({ error });

    res.status(201).json(data[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const top = parseInt(req.query.top) || 10;

    const { data, error } = await supabase
      .from("memes")
      .select("*")
      .order("upvotes", { ascending: false })
      .limit(top);

    if (error) return res.status(400).json({ error });
    const topMeme = await Promise.all(
      data.map(async (meme) => {
        const { data: bidData, error: bidError } = await supabase
          .from("bids")
          .select("credits")
          .eq("meme_id", meme.id)
          .order("credits", { ascending: false })
          .limit(1)
          .single();

        return {
          ...meme,
          highest_bid: bidData?.credits || 0,
          bidder: "CyberPunk",
        };
      })
    );

    res.status(200).json(topMeme);
  } catch (err) {
    console.error("Leaderboard error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
exports.generateCaption = async (req, res) => {
  const memeId = req.params.id;

  try {
    const { data: memeData, error: memeError } = await supabase
      .from("memes")
      .select("*")
      .eq("id", memeId)
      .single();

    if (memeError || !memeData)
      return res.status(404).json({ error: "Meme not found" });

    const { tags } = memeData;
    const prompt = `Generate a funny caption for a meme with tags: ${tags.join(
      ", "
    )}`;

    const fallbackCaptions = ["HODL to the moon!", "Stonks only go up!"];
    let caption =
      fallbackCaptions[Math.floor(Math.random() * fallbackCaptions.length)];

    try {
      console.log("Inside the try block");
      const geminiApiKey = process.env.GEMINI_API_KEY;
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );
      console.log(" Gemini Caption Response:", response.data);
      const rawText = response.data.candidates[0].content.parts[0].text;

      const matches = rawText.match(/(?:\*|-)\s*"(.*?)"/g);
      if (matches && matches.length > 0) {
        caption = matches[0]
          .replace(/(?:\*|-)\s*"/, "")
          .replace(/"$/, "")
          .trim();
      } else {
        const lines = rawText
          .split("\n")
          .map((line) => line.trim())
          .filter(
            (line) => line && !line.startsWith("*") && !line.endsWith(":")
          );

        caption = lines[0] || "🤖 Meme generator glitched!";
      }
    } catch (err) {
      console.log("⚠️ Gemini API (caption) failed, using fallback.");
      if (err.response) {
        console.error(
          "❌ Response Error:",
          err.response.status,
          err.response.statusText
        );
        console.error("❌ Response Data:", err.response.data);
      } else if (err.request) {
        console.error("❌ No Response Received:", err.request);
      } else {
        console.error("❌ Axios Error:", err.message);
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from("memes")
      .update({ caption })
      .eq("id", memeId)
      .select()
      .single();

    if (updateError) {
      return res
        .status(500)
        .json({ error: "Update failed", details: updateError });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.generateVibe = async (req, res) => {
  const memeId = req.params.id;

  try {
    const { data: memeData, error: memeError } = await supabase
      .from("memes")
      .select("*")
      .eq("id", memeId)
      .single();

    if (memeError || !memeData)
      return res.status(404).json({ error: "Meme not found" });

    const { tags } = memeData;
    const prompt = `Describe the vibe of a meme with tags: ${tags.join(", ")}`;

    const fallbackVibes = [
      "Neon Crypto Chaos",
      "Retro Hacker Madness",
      "Blade Runner LOLscape",
    ];
    let vibe = fallbackVibes[Math.floor(Math.random() * fallbackVibes.length)];

    try {
      const geminiApiKey = process.env.GEMINI_API_KEY;
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );
      const match = rawVibe.match(/\*\*(.*?)\*\*/);
      if (match && match[1]) {
        vibe = match[1].trim().replace(/:$/, "");
      } else {
        const lines = rawVibe
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line && !line.endsWith(":"));

        vibe = lines[0]?.replace(/:$/, "") || "🌐 Meme Vibe Unavailable";
      }
    } catch (err) {
      console.log("⚠️ Gemini API (vibe) failed, using fallback.");
    }

    const { data: updated, error: updateError } = await supabase
      .from("memes")
      .update({ vibe })
      .eq("id", memeId)
      .select()
      .single();

    if (updateError) {
      return res
        .status(500)
        .json({ error: "Update failed", details: updateError });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getHighestBid = async (req, res) => {
  const memeId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("bids")
      .select("credits")
      .eq("meme_id", memeId)
      .order("credits", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ message: "Error fetching bid", error });
    }

    if (!data) {
      return res.status(404).json({ message: "No bids found for this meme." });
    }

    return res.json({
      highest_bid: data.credits,
      bidder: "CyberPunk",
    });
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
