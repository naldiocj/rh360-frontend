export {};

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognition | undefined;
    webkitSpeechRecognition: SpeechRecognition | undefined;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
  }
}
