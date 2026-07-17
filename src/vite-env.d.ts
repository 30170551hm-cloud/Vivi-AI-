/// <reference types="vite/client" />

interface Window {
  SpeechRecognition?: {
    new (): SpeechRecognition;
  };
  webkitSpeechRecognition?: {
    new (): SpeechRecognition;
  };
  webkitAudioContext?: typeof AudioContext;
}
