const express = require("express");
const cors = require("cors");
require("dotenv").config();

const memeRoutes = require("./routes/memeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", memeRoutes);

app.get("/", (req, res) => {
  res.send("🔥 MemeHustle backend running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
