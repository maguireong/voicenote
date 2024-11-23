import base64
import os
from flask import Flask, request, send_file
from flask_cors import CORS  # Import CORS
import io
import ffmpeg

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

FLASK_ENV = os.getenv("ENV", "development")
BASE_URL = os.getenv("BASE_URL", ("*"))

if FLASK_ENV == "production":
    print("Running in production mode")
else:
    print("Running in development mode")
    print(BASE_URL)

# Use environment variables for configuration
CORS(app, origins="http://localhost:49588")

@app.route('/api/convert', methods=['POST'])
def convert_audio():
    try:
        # Retrieve the audio data from the request
        audio_data_base64 = request.get_json()['audioData']
        # Decode Base64 back to binary data
        audio_data = base64.b64decode(audio_data_base64)
        audio_file = io.BytesIO(audio_data) # Convert the data to a file-like object

        # Temporary file for storing the input WebM file
        input_file = '../src/assets/input.webm'
        output_file = '../src/assets/audio.mp3'

        # Remove the file if it already exists
        if os.path.exists(output_file):
            os.remove(output_file)

        # Save the audio data to a temporary file
        print("saving audio data")
        with open(input_file, 'wb') as f:
            f.write(audio_data)

        # Use FFmpeg to convert the WebM file to MP3
        ffmpeg.input(input_file).output(output_file, codec='libmp3lame', audio_bitrate='192k').run()

        # Return the converted MP3 file
        return send_file(output_file, mimetype='audio/mp3', as_attachment=True, download_name='converted_audio.mp3')

    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
