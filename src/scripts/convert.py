# convert.py
import subprocess
import sys

def convert_audio(input_file, output_file):
    command = ['ffmpeg', '-i', input_file, '-codec:a', 'libmp3lame', '-q:a', '2', output_file]
    subprocess.run(command, check=True)

if __name__ == "__main__":
    input_file = sys.argv[1]  # Input file path
    output_file = sys.argv[2]  # Output file path
    convert_audio(input_file, output_file)
