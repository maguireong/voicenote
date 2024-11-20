const express = require("express");
const { exec } = require("child_process");
const fetch = require("cross-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/transcribe", (req, res) => {
  console.log("Transcribing...");

  // Define absolute paths for audio and output text file
  const audioPath = "../../assets/audio.mp3";
  const outputPath = "../../assets/audio.txt";

  // Execute the Python script using the correct paths
  exec(
    `python3 "../../scripts/transcribe.py" "${audioPath}" "${outputPath}"`,
    (error, stdout, stderr) => {
      console.log("Transcription complete, sending response back");
      if (error) {
        console.error(`Execution error: ${error.message}`);
        return res.status(500).send(`Error: ${error.message}`);
      }
      res.send(stdout);
    }
  );
});

const NOTION_TOKEN = "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";
const DATABASE_ID = "12e726ebeb6f80258371c7dd12c94f9d";

app.post("/create-page", async (req, res) => {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: DATABASE_ID },
      properties: req.body.properties,
    }),
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
