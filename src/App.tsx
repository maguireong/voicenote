import React, { useState, useRef, useEffect } from "react";
import { convertWebMToMP3, startSpeechToTextConverter } from "./utils";

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [error, setError] = useState<string | null>(null);
  const audioRecorder = useRef<AudioRecorder | null>(null);
  const elapsedTimeRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const [uploadingStatus, setUploadingStatus] = useState<string>(null);

  const maximumRecordingTimeInHours = 1;

  // Audio Recorder API Helper
  class AudioRecorder {
    audioBlobs: Blob[] = [];
    mediaRecorder: MediaRecorder | null = null;
    stream: MediaStream | null = null;

    async start(): Promise<void> {
      if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        throw new Error("Browser does not support media devices.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.stream = stream;
      this.mediaRecorder = new MediaRecorder(stream);

      this.audioBlobs = [];
      this.mediaRecorder.ondataavailable = (event) =>
        this.audioBlobs.push(event.data);
      this.mediaRecorder.start();
    }

    stop(): Promise<Blob> {
      return new Promise((resolve, reject) => {
        if (!this.mediaRecorder)
          return reject(new Error("No active media recorder."));
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioBlobs, {
            type: this.mediaRecorder?.mimeType,
          });
          resolve(audioBlob);
        };
        this.mediaRecorder.stop();
        this.cleanup();
      });
    }

    cancel(): void {
      if (this.mediaRecorder) this.mediaRecorder.stop();
      this.cleanup();
    }

    private cleanup(): void {
      this.stream?.getTracks().forEach((track) => track.stop());
      this.stream = null;
      this.mediaRecorder = null;
    }
  }

  // Start recording
  const startAudioRecording = async () => {
    try {
      setUploadingStatus(null);
      if (audioUrl) {
        const audio = document.getElementById(
          "audio-element"
        ) as HTMLAudioElement;
        audio.pause();
      }

      audioRecorder.current = new AudioRecorder();
      await audioRecorder.current.start();
      setIsRecording(true);
      startTimeRef.current = new Date();
      startElapsedTimer();
    } catch (err) {
      setError(
        "Unable to start recording. Please check browser support and permissions."
      );
    }
  };

  // Stop recording
  const stopAudioRecording = async () => {
    try {
      if (audioRecorder.current) {
        const audioBlob = await audioRecorder.current.stop();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        console.log(audioUrl);
        stopElapsedTimer();
      }
    } catch (err) {
      console.error("Error stopping recording:", err);
    } finally {
      setIsRecording(false);
    }
  };

  // Cancel recording
  const cancelAudioRecording = () => {
    if (audioRecorder.current) {
      audioRecorder.current.cancel();
      setIsRecording(false);
      stopElapsedTimer();
    }
  };

  // Handle elapsed time
  const startElapsedTimer = () => {
    elapsedTimeRef.current = setInterval(() => {
      const elapsed = computeElapsedTime(startTimeRef.current!);
      setElapsedTime(elapsed);

      if (elapsedTimeReachedMax(elapsed)) {
        stopAudioRecording();
      }
    }, 1000);
  };

  const stopElapsedTimer = () => {
    if (elapsedTimeRef.current) {
      clearInterval(elapsedTimeRef.current);
      elapsedTimeRef.current = null;
    }
    setElapsedTime("00:00");
  };

  const computeElapsedTime = (startTime: Date): string => {
    const endTime = new Date();
    let timeDiff = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const seconds = timeDiff % 60;
    const minutes = Math.floor((timeDiff / 60) % 60);
    const hours = Math.floor(timeDiff / 3600);

    const pad = (num: number) => (num < 10 ? "0" + num : num);
    return hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;
  };

  const elapsedTimeReachedMax = (elapsed: string): boolean => {
    const [hours] = elapsed.split(":").map(Number);
    return hours >= maximumRecordingTimeInHours;
  };

  return (
    <div className="bg-red-600">
      {error && <div className="error">{error}</div>}
      {!isRecording && (
        <button
          onClick={startAudioRecording}
          className="start-recording-button"
        >
          Start Recording
        </button>
      )}
      {isRecording && (
        <div className="recording-controls">
          <p>Recording... {elapsedTime}</p>
          <button
            onClick={stopAudioRecording}
            className="stop-recording-button"
          >
            Stop
          </button>
          <button
            onClick={cancelAudioRecording}
            className="cancel-recording-button"
          >
            Cancel
          </button>
        </div>
      )}
      {!isRecording && audioUrl && (
        <>
          <div className="audio-playback">
            <audio id="audio-element" controls>
              <source src={audioUrl} type="audio/webm" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <button
            onClick={async () => {
              setUploadingStatus("Uploading...");
              await convertWebMToMP3(audioUrl);
              console.log("Save to notion");
              const status = await startSpeechToTextConverter();
              setUploadingStatus(
                status === 200
                  ? "Upload successful!"
                  : "Oops, something went wrong"
              );
            }}
          >
            Convert to mp3 and save to notion
          </button>
          <div>{uploadingStatus}</div>
        </>
      )}
    </div>
  );
};

export default App;
