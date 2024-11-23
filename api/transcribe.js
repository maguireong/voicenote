const { exec } = require("child_process");
const path = require("path");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      console.log("Transcribing...");

      // Define absolute paths for audio and output text file
      // const audioPath = path.resolve(__dirname, "../public/audio.mp3");
      // const outputPath = path.resolve(__dirname, "../public/audio.txt");
      // const transcribeScriptPath = path.resolve(
      //     __dirname,
      //     "../src/scripts/transcribe.py"
      //   )
      const audioPath = "/tmp/audio.mp3";
      const outputPath = "/tmp/audio.txt";
      const transcribeScriptPath = "../src/scripts/transcribe.py";

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
