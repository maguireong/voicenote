import base64
import os
from flask import Flask, request, send_file
from flask_cors import CORS  # Import CORS
import io
import ffmpeg
import tempfile

# from dotenv import load_dotenv
# load_dotenv()

app = Flask(__name__)

# FLASK_ENV = os.getenv("ENV", "development")
# BASE_URL = os.getenv("BASE_URL", ("*"))

# if FLASK_ENV == "production":
#     print("Running in production mode")
# else:
#     print("Running in development mode")
#     print(BASE_URL)

# Use environment variables for configuration
CORS(app, resources={
    r"/api/*": {  # Apply CORS to all endpoints under `/api/*`
        "origins": [
            "https://*.vercel.app", # Deployed frontend domain
            "http://localhost:3000"  # Local testing
        ],
        "methods": ["GET", "POST"],  # Allowed HTTP methods
        "allow_headers": ["Content-Type"],  # Allowed headers
        "supports_credentials": True  # Enable credentials (if needed)
    }
})

@app.route('/api/convert', methods=['POST'])
def convert_audio():
    try:
        # Retrieve the audio data from the request
        audio_data_base64 = request.get_json()['audioData']
        audio_data = base64.b64decode(audio_data_base64)

        # Define temporary file paths
        input_file = os.path.join(tempfile.gettempdir(), 'input.webm')
        output_file = os.path.join(tempfile.gettempdir(), 'output.mp3')
        print(output_file)

        # Save the input audio file to /tmp
        with open(input_file, 'wb') as f:
            f.write(audio_data)

        # Example: Simulate a file processing step
        # Convert input_file to output_file (e.g., using FFmpeg)
        ffmpeg.input(input_file).output(output_file, codec='libmp3lame', audio_bitrate='192k').run()

        # Return a success response (or send the file back if needed)
        return {"message": "File processed successfully", "outputFile": output_file}, 200

    except Exception as e:
        return {"error": str(e)}, 500

