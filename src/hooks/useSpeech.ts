import { useState, useCallback, useEffect } from "react";

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(
    typeof window !== "undefined" && "speechSynthesis" in window
  );
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);

  // 사용 가능한 음성 목록 로드
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    // 음성 목록이 이미 로드되어 있으면 바로 설정
    loadVoices();

    // 일부 브라우저에서는 음성 목록이 비동기로 로드됨
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  // 언어별로 최적의 음성 선택 (미국식 발음 우선)
  const getBestVoice = useCallback(
    (lang: string) => {
      if (availableVoices.length === 0) return null;

      // 미국식 영어 발음에 특화된 고품질 음성 (발음 품질 우선순위)
      const preferredVoices = {
        "en-US": [
          // 최고 품질 미국 영어 음성들
          "Samantha", // macOS - 가장 자연스러운 미국식 발음
          "Alex", // macOS - 매우 명확한 미국식 발음 (남성)
          "Microsoft David Desktop", // Windows 고품질 남성
          "Microsoft Zira Desktop", // Windows 고품질 여성
          "Google US English", // Chrome 표준
          "Microsoft David", // Windows 표준 남성
          "Microsoft Zira", // Windows 표준 여성
          "Karen", // iOS 여성
          "Daniel", // macOS 남성
          "Moira", // macOS 여성
          "Tessa", // macOS 여성
          "Tom", // macOS 남성
          "Fred", // macOS 남성
          "Victoria", // macOS 여성
          "Allison", // macOS 여성
          "Ava", // macOS 여성
          "Susan", // macOS 여성
        ],
        "ko-KR": [
          "Yuna", // macOS 한국어 여성
          "Microsoft Heami Desktop", // Windows 고품질
          "Google 한국의", // Chrome
          "Microsoft Heami",
        ],
      };

      const targetLang = lang.includes("ko") ? "ko-KR" : "en-US";
      const preferredNames = preferredVoices[targetLang];

      // 1순위: 선호하는 음성 이름으로 정확히 매칭
      for (const voiceName of preferredNames) {
        const voice = availableVoices.find(
          (v) =>
            v.name.includes(voiceName) &&
            (v.lang.startsWith(targetLang.split("-")[0]) ||
              v.lang === targetLang)
        );
        if (voice) return voice;
      }

      // 2순위: 미국 영어 (en-US) 정확히 매칭하는 음성
      if (targetLang === "en-US") {
        const usVoice = availableVoices.find((voice) => voice.lang === "en-US");
        if (usVoice) return usVoice;
      }

      // 3순위: 해당 언어의 모든 음성 중 첫 번째
      const langVoice = availableVoices.find(
        (voice) =>
          voice.lang.startsWith(targetLang.split("-")[0]) ||
          voice.lang === targetLang
      );
      if (langVoice) return langVoice;

      // 4순위: 기본 음성
      return availableVoices[0] || null;
    },
    [availableVoices]
  );

  const speak = useCallback(
    (text: string, lang: string = "en-US") => {
      if (!isSupported) {
        console.warn("Speech synthesis not supported");
        return;
      }

      // 현재 재생 중인 음성이 있다면 중지
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      // 최적의 음성 선택
      const bestVoice = getBestVoice(lang);
      if (bestVoice) {
        utterance.voice = bestVoice;
        console.log(`🎙️ 사용 중인 음성: ${bestVoice.name} (${bestVoice.lang})`);
      }

      // 음성 설정 최적화 (미국식 발음에 맞게)
      utterance.rate = 0.8; // 적당한 속도 (너무 빠르지 않게)
      utterance.pitch = 1.0; // 자연스러운 톤
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, getBestVoice]
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  // 디버깅용: 사용 가능한 음성 목록 확인
  const getAvailableVoices = useCallback(() => {
    return availableVoices.map((voice) => ({
      name: voice.name,
      lang: voice.lang,
      gender:
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("woman")
          ? "female"
          : voice.name.toLowerCase().includes("male") ||
            voice.name.toLowerCase().includes("man")
          ? "male"
          : "unknown",
    }));
  }, [availableVoices]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    availableVoices: getAvailableVoices(),
  };
};
