import { createPage } from "./notionClient/createPage";

export async function startSpeechToTextConverter() {
  console.log("Transcribing audioooo");
  const response = await fetch("http://localhost:3001/transcribe");
  const text = await response.text();
  console.log(text);

  // Create a page in Notion
  const status = await createPage(text);
  console.log(status);
  return status;
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const length = bytes.byteLength;
  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary); // Encode as Base64
}

export async function convertWebMToMP3(blobUrl: string) {
  console.log("Converting audio to mp3: " + blobUrl);

  try {
    // Fetch the Blob data from the URL
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch the Blob");
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    // Convert ArrayBuffer to Base64 string
    const base64Audio = arrayBufferToBase64(arrayBuffer);

    // Send the Blob data as a POST request to the Python backend
    const res = await fetch("http://localhost:5001/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioData: base64Audio }), // Send the audioUrl as JSON payload
    });

    if (!res.ok) {
      throw new Error("Failed to convert audio");
    }

    console.log("Conversion successful!", res);
    return res.ok;
  } catch (error) {
    console.error("Error during conversion:", error);
  }
}
