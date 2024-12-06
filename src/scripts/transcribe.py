import whisper
import os

def transcribe_audio(audio_path, output_path):
    
    model = whisper.load_model("base")
    result = model.transcribe(audio_path, language='en')
    
    # Save the transcribed text to a file
    print(result["text"])
    with open(output_path, 'w') as f:
        f.write(result["text"])

if __name__ == "__main__":
    import sys
    audio_path = sys.argv[1]
    output_path = sys.argv[2]
    
    transcribe_audio(audio_path, output_path)
