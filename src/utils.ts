import { createPage } from "./notionClient/createPage";

const convertUrl =
  process.env.ENV === "production"
    ? "/api/convert"
    : `http://localhost:5000/api/convert`; // Local API for development

const transcribeUrl =
  process.env.ENV === "production"
    ? "/api/transcribe"
    : `http://localhost:3000/api/transcribe`;

console.log("ENV in code:", process.env.ENV);
console.log("NEXT_PUBLIC_ENV in code:", process.env.NEXT_PUBLIC_ENV);
console.log(convertUrl);
if (process.env.ENV == "production") {
  console.log("Running in production mode");
} else {
  console.log("Running in development mode");
}

export async function startSpeechToTextConverter() {
  console.log("Transcribing audio...");

  try {
    // Request transcribed text from backend
    const response = await fetch(transcribeUrl);
    if (!response.ok) {
      throw new Error("Failed to transcribe audio");
    }

    const text = await response.text();
    console.log(text);

    console.log("Creating page...");

    // Create a page in Notion
    const status = await createPage(text);
    console.log(status);
    return status;
  } catch (error) {
    console.error("Error during speech-to-text conversion:", error);
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer | Iterable<number>) {
  let binary = "";
  const bytes = new Uint8Array(buffer as Iterable<number>);
  const length = bytes.byteLength;
  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary); // Encode as Base64
}

export async function convertWebMToMP3(blobUrl: string | URL | Request) {
  console.log("Converting audio to MP3:", blobUrl);

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
    const res = await fetch(convertUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioData: base64Audio }), // Send the audioUrl as JSON payload
    });

    if (!res.ok) {
      throw new Error("Failed to convert audio");
    }

    console.log("Conversion successful!");
    return res.ok;
  } catch (error) {
    console.error("Error during conversion:", error);
  }
}
