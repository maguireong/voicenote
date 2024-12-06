const { exec } = require("child_process");
const path = require("path");
const os = require("os");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      console.log("Transcribing...");

      // Define absolute paths for audio and output text file
      const audioPath = "/tmp/output.mp3";
      const outputPath = "/tmp/audio.txt";
      console.log(audioPath);

      // const response = await fetch(audioPath, { method: "HEAD" });
      // if (response.ok) {
      //   console.log("File exists!");
      // } else {
      //   console.log("File does not exist.");
      // }

      const transcribeScriptPath = path.join(
        __dirname,
        "../src/scripts/transcribe.py"
      );

      // Execute the Python script using the correct paths
      exec(
        `python3 ${transcribeScriptPath} "${audioPath}" "${outputPath}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Execution error: ${error.message}`);
            return res.status(500).send(`Error: ${error.message}`);
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
          }
          console.log("Transcription complete, sending response back");
          res.status(200).send(stdout);
        }
      );
    } catch (error) {
      console.error("Error in transcribing", error);
      res.status(500).send("Error in transcribing the audio.");
    }
  } else {
    // Handle unsupported HTTP methods (e.g., POST, PUT, etc.)
    res.status(405).send("Method Not Allowed");
  }
};
