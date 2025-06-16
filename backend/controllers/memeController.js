const supabase = require("../services/supabaseClient");
const axios = require("axios");

exports.createMeme = async (req, res) => {
  try {
    const { title, image_url, tags, owner_id } = req.body;

    if (!title || !owner_id || !Array.isArray(tags)) {
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
          owner_id,
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
    const { data, error } = await supabase
      .from("memes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error });

    res.status(200).json(data);
  } catch (err) {
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
    const { user_id, credits } = req.body;

    if (!user_id || typeof credits !== "number") {
      return res
        .status(400)
        .json({ error: "user_id and credits are required" });
    }

    const { data, error } = await supabase
      .from("bids")
      .insert([
        {
          meme_id: memeId,
          user_id,
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

    res.status(200).json(data);
  } catch (err) {
    console.error("Leaderboard error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.generateCaptionAndVibe = async (req, res) => {
  const memeId = req.params.id;

  try {
    const { data: memeData, error: memeError } = await supabase
      .from("memes")
      .select("*")
      .eq("id", memeId)
      .single();

    if (memeError || !memeData)
      return res.status(404).json({ error: "Meme not found" });

    const { tags, title } = memeData;

    const promptForCaption = `Generate a funny caption for a meme with tags: ${tags.join(
      ", "
    )}`;
    const promptForVibe = `Describe the vibe of a meme with tags: ${tags.join(
      ", "
    )}`;

    const fallbackCaptions = [
      "HODL to the moon!",
      "Stonks only go up!",
      "404 logic not found",
    ];
    const fallbackVibes = [
      "Neon Crypto Chaos",
      "Retro Hacker Madness",
      "Blade Runner LOLscape",
    ];

    let caption =
      fallbackCaptions[Math.floor(Math.random() * fallbackCaptions.length)];
    let vibe = fallbackVibes[Math.floor(Math.random() * fallbackVibes.length)];

    try {
      const geminiApiKey = process.env.GEMINI_API_KEY; // add this in your .env

      const responseCaption = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          geminiApiKey,
        {
          contents: [{ parts: [{ text: promptForCaption }] }],
        }
      );

      caption = responseCaption.data.candidates[0].content.parts[0].text;

      const responseVibe = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          geminiApiKey,
        {
          contents: [{ parts: [{ text: promptForVibe }] }],
        }
      );

      vibe = responseVibe.data.candidates[0].content.parts[0].text;
    } catch (geminiErr) {
      console.log("⚠️ Gemini API failed, using fallback.");
    }

    const { data: updated, error: updateError } = await supabase
      .from("memes")
      .update({ caption, vibe })
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
