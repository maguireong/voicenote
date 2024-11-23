# Use an official Python runtime as a base image
FROM python:3.9-slim

# Install FFmpeg and other dependencies
RUN apt-get update && apt-get install -y ffmpeg

# Install your Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the application code
COPY . /app

# Set the working directory
WORKDIR /app

# Run your Python script (or start your app)
CMD ["python", "your_script.py"]
