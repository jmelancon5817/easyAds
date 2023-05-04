const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const openai = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";
const ENGINE_ID = "davinci-codex";

app.post("/generateScript", async (req, res) => {
  const { prompt, max_tokens, temperature } = req.body;
  try {
    const response = await openai.complete({
      engine: ENGINE_ID,
      prompt,
      maxTokens: max_tokens,
      temperature: temperature,
      apiKey: OPENAI_API_KEY,
    });
    const generatedScript = response.choices[0].text.trim();
    res.json({ generatedScript });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
