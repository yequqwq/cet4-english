import { useCallback, useEffect, useRef } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  currentWord: string | null;
}

export const useAudioPlayer = () => {
  const stateRef = useRef<AudioPlayerState>({
    isPlaying: false,
    currentWord: null,
  });

  const cancelCurrentAudio = useCallback(() => {
    if (stateRef.current.isPlaying) {
      speechSynthesis.cancel();
      stateRef.current.isPlaying = false;
      stateRef.current.currentWord = null;
    }
  }, []);

  const speak = useCallback((text: string, options: { rate?: number; lang?: string } = {}) => {
    cancelCurrentAudio();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 0.8;

    stateRef.current.isPlaying = true;
    stateRef.current.currentWord = text;

    utterance.onend = () => {
      if (stateRef.current.currentWord === text) {
        stateRef.current.isPlaying = false;
        stateRef.current.currentWord = null;
      }
    };

    utterance.onerror = () => {
      stateRef.current.isPlaying = false;
      stateRef.current.currentWord = null;
    };

    speechSynthesis.speak(utterance);
  }, [cancelCurrentAudio]);

  const playWord = useCallback((word: string) => {
    return new Promise<void>((resolve) => {
      cancelCurrentAudio();

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;

      stateRef.current.isPlaying = true;
      stateRef.current.currentWord = word;

      utterance.onend = () => {
        if (stateRef.current.currentWord === word) {
          stateRef.current.isPlaying = false;
          stateRef.current.currentWord = null;
        }
        resolve();
      };

      utterance.onerror = () => {
        stateRef.current.isPlaying = false;
        stateRef.current.currentWord = null;
        resolve();
      };

      speechSynthesis.speak(utterance);
    });
  }, [cancelCurrentAudio]);

  const playExample = useCallback((example: string) => {
    return new Promise<void>((resolve) => {
      cancelCurrentAudio();

      const utterance = new SpeechSynthesisUtterance(example);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;

      stateRef.current.isPlaying = true;
      stateRef.current.currentWord = example;

      utterance.onend = () => {
        if (stateRef.current.currentWord === example) {
          stateRef.current.isPlaying = false;
          stateRef.current.currentWord = null;
        }
        resolve();
      };

      utterance.onerror = () => {
        stateRef.current.isPlaying = false;
        stateRef.current.currentWord = null;
        resolve();
      };

      speechSynthesis.speak(utterance);
    });
  }, [cancelCurrentAudio]);

  const preloadVoice = useCallback(() => {
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find((v) => v.lang.startsWith('en-US'));
        if (englishVoice) {
          const testUtterance = new SpeechSynthesisUtterance('');
          testUtterance.voice = englishVoice;
        }
      };
    }
  }, []);

  useEffect(() => {
    preloadVoice();

    return () => {
      cancelCurrentAudio();
    };
  }, [preloadVoice, cancelCurrentAudio]);

  return {
    speak,
    playWord,
    playExample,
    cancelCurrentAudio,
    isPlaying: () => stateRef.current.isPlaying,
  };
};