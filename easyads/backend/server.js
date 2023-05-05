const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const modelID = "gpt-3.5-turbo";

app.post("/generateScript", async (req, res) => {
  try {
    const { prompt } = req.body;
    const messages = [
      { role: "user", content: prompt },
      {
        role: "system",
        content:
          "You are a helpful assistant that creates professional and succinct advertisment scripts for products or services.",
      },
    ];
    const completion = await openai.createChatCompletion({
      model: modelID,
      messages: messages,
    });
    console.log(completion.data.choices[0].message);
    res.json({ script: completion.data.choices[0].message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
