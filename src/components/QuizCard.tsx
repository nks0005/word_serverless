import React, { useState, useEffect, useRef } from "react";
import { Volume2, Clock, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import type { QuizQuestion } from "../types/word";
import { useSpeech } from "../hooks/useSpeech";

interface QuizCardProps {
  question: QuizQuestion;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showResult: boolean;
  timeLeft?: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult,
  timeLeft,
}) => {
  const { speak, isSpeaking, isSupported } = useSpeech();
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(0);
  const questionRef = useRef<HTMLDivElement>(null);

  // 정답일 때 축하 애니메이션
  useEffect(() => {
    if (showResult && selectedAnswer === question.correctAnswer) {
      setConfettiVisible(true);
      setTimeout(() => setConfettiVisible(false), 2000);
    }
  }, [showResult, selectedAnswer, question.correctAnswer]);

  // 문제가 바뀔 때 포커스 리셋
  useEffect(() => {
    setFocusedOptionIndex(0);
    if (questionRef.current) {
      questionRef.current.focus();
    }
  }, [question.id]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showResult) return;

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          setFocusedOptionIndex((prev) =>
            prev < question.options.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          setFocusedOptionIndex((prev) =>
            prev > 0 ? prev - 1 : question.options.length - 1
          );
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          onAnswerSelect(question.options[focusedOptionIndex]);
          break;
        case "1":
        case "2":
        case "3":
        case "4":
          event.preventDefault();
          const optionIndex = parseInt(event.key) - 1;
          if (optionIndex < question.options.length) {
            onAnswerSelect(question.options[optionIndex]);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showResult, focusedOptionIndex, question.options, onAnswerSelect]);

  const handleSpeak = () => {
    if (question.type === "english-to-korean") {
      speak(question.word.english, "en-US");
    } else {
      speak(question.word.korean, "ko-KR");
    }
  };

  const getQuestionText = () => {
    return question.type === "english-to-korean"
      ? question.word.english
      : question.word.korean;
  };

  const getButtonStyle = (option: string, index: number) => {
    const isFocused = index === focusedOptionIndex && !showResult;
    let baseStyle =
      "w-full p-6 rounded-2xl border-3 text-left transition-all duration-300 text-lg font-medium";

    if (!showResult) {
      if (selectedAnswer === option) {
        baseStyle +=
          " bg-blue-500 text-white border-blue-500 shadow-lg scale-105";
      } else if (isFocused) {
        baseStyle +=
          " bg-blue-50 text-gray-700 border-blue-400 hover:bg-blue-100 shadow-md ring-2 ring-blue-300";
      } else {
        baseStyle +=
          " bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md";
      }
    } else {
      if (option === question.correctAnswer) {
        baseStyle +=
          " bg-green-500 text-white border-green-500 shadow-lg animate-pulse";
      } else if (
        selectedAnswer === option &&
        option !== question.correctAnswer
      ) {
        baseStyle += " bg-red-500 text-white border-red-500 shadow-lg";
      } else {
        baseStyle += " bg-gray-100 text-gray-500 border-gray-300";
      }
    }

    if (showResult) {
      baseStyle += " cursor-not-allowed";
    } else {
      baseStyle += " cursor-pointer hover:scale-102";
    }

    return baseStyle;
  };

  const getTimerColor = () => {
    if (!timeLeft) return "text-gray-500";
    if (timeLeft <= 5) return "text-red-500 animate-pulse";
    if (timeLeft <= 10) return "text-orange-500";
    return "text-green-500";
  };

  const getQuestionTypeEmoji = () => {
    return question.type === "english-to-korean" ? "🇺🇸 ➡️ 🇰🇷" : "🇰🇷 ➡️ 🇺🇸";
  };

  const isCorrect = showResult && selectedAnswer === question.correctAnswer;
  const isWrong = showResult && selectedAnswer !== question.correctAnswer;

  const getTimerAnnouncement = () => {
    if (!timeLeft) return "";
    if (timeLeft <= 5) return "시간이 얼마 남지 않았습니다!";
    if (timeLeft <= 10) return "시간에 주의하세요.";
    return "";
  };

  return (
    <div className="relative">
      {/* 축하 컨페티 효과 */}
      {confettiVisible && (
        <div
          className="absolute inset-0 pointer-events-none z-20"
          aria-hidden="true"
        >
          <div className="confetti-animation">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: [
                    "#ff6b6b",
                    "#4ecdc4",
                    "#45b7d1",
                    "#ffd93d",
                    "#6c5ce7",
                  ][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div
        ref={questionRef}
        tabIndex={-1}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-3xl mx-auto border-4 border-blue-100 relative focus:outline-none focus:ring-4 focus:ring-blue-300"
        role="main"
        aria-label="퀴즈 문제"
      >
        {/* 스크린 리더용 안내 */}
        <div className="sr-only">
          {question.type === "english-to-korean"
            ? "영어 단어를 보고 한국어 뜻을 고르는 문제입니다."
            : "한국어 뜻을 보고 영어 단어를 고르는 문제입니다."}
          {timeLeft && `남은 시간: ${timeLeft}초. ${getTimerAnnouncement()}`}
        </div>

        {/* 타이머 */}
        {timeLeft !== undefined && (
          <div className="flex items-center justify-center mb-6">
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 ${
                timeLeft <= 10
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <Clock
                className={`w-6 h-6 ${getTimerColor()}`}
                aria-hidden="true"
              />
              <span className={`font-bold text-2xl ${getTimerColor()}`}>
                {timeLeft}초
              </span>
              {timeLeft <= 10 && (
                <span className="text-lg" aria-hidden="true">
                  ⏰
                </span>
              )}
            </div>
          </div>
        )}

        {/* 문제 유형 표시 */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-6 py-2 rounded-full text-lg font-semibold">
            <span aria-hidden="true">{getQuestionTypeEmoji()}</span>
            <span>
              {question.type === "english-to-korean"
                ? "영어를 한국어로!"
                : "한국어를 영어로!"}
            </span>
          </div>
        </div>

        {/* 문제 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-3xl shadow-lg">
              <h2 className="text-4xl font-bold" id="question-text">
                {getQuestionText()}
              </h2>
            </div>

            {isSupported && (
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="p-4 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors border-2 border-orange-300 group focus:ring-4 focus:ring-orange-300"
                title="발음 듣기"
                aria-label={`${getQuestionText()} 발음 듣기`}
              >
                <Volume2
                  className={`w-8 h-8 text-orange-600 ${
                    isSpeaking ? "animate-pulse" : "group-hover:scale-110"
                  } transition-transform`}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>

          {/* 발음 기호 */}
          {question.word.phonetic && (
            <div className="bg-gray-50 rounded-2xl px-6 py-3 inline-block">
              <p
                className="text-gray-600 text-lg font-mono"
                aria-label={`발음: ${question.word.phonetic}`}
              >
                🔊 {question.word.phonetic}
              </p>
            </div>
          )}
        </div>

        {/* 키보드 안내 */}
        {!showResult && (
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">
              💡 키보드로도 답할 수 있어요: 화살표 키로 선택, 엔터키로 답하기,
              또는 1-4 숫자키 사용
            </p>
          </div>
        )}

        {/* 선택지 */}
        <div
          className="grid gap-4"
          role="radiogroup"
          aria-labelledby="question-text"
        >
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && onAnswerSelect(option)}
              disabled={showResult}
              className={getButtonStyle(option, index)}
              role="radio"
              aria-checked={selectedAnswer === option}
              aria-disabled={showResult}
              aria-label={`선택지 ${String.fromCharCode(
                65 + index
              )}: ${option}`}
              tabIndex={showResult ? -1 : index === focusedOptionIndex ? 0 : -1}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 ${
                    option === question.correctAnswer && showResult
                      ? "bg-white text-green-500 border-white"
                      : selectedAnswer === option &&
                        showResult &&
                        option !== question.correctAnswer
                      ? "bg-white text-red-500 border-white"
                      : selectedAnswer === option
                      ? "bg-white text-blue-500 border-white"
                      : "bg-blue-100 text-blue-600 border-blue-200"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1">{option}</span>
                {showResult && option === question.correctAnswer && (
                  <CheckCircle
                    className="w-8 h-8 text-white"
                    aria-hidden="true"
                  />
                )}
                {showResult &&
                  selectedAnswer === option &&
                  option !== question.correctAnswer && (
                    <XCircle
                      className="w-8 h-8 text-white"
                      aria-hidden="true"
                    />
                  )}
              </div>
            </button>
          ))}
        </div>

        {/* 결과 표시 */}
        {showResult && (
          <div className="mt-8" role="alert" aria-live="polite">
            {/* 정답/오답 메시지 */}
            <div
              className={`text-center p-6 rounded-2xl ${
                isCorrect
                  ? "bg-green-50 border-2 border-green-200"
                  : "bg-red-50 border-2 border-red-200"
              }`}
            >
              <div className="text-6xl mb-3" aria-hidden="true">
                {isCorrect ? "🎉" : "😅"}
              </div>
              <h3
                className={`text-2xl font-bold mb-2 ${
                  isCorrect ? "text-green-700" : "text-red-700"
                }`}
              >
                {isCorrect ? "정답이에요!" : "아쉬워요!"}
              </h3>
              <p
                className={`text-lg ${
                  isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCorrect
                  ? "잘했어요! 계속 힘내세요! 💪"
                  : `정답은 "${question.correctAnswer}"이에요. 다음엔 맞힐 수 있을 거예요! 🌟`}
              </p>
            </div>

            {/* 예문 표시 */}
            {question.word.example && (
              <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Lightbulb
                    className="w-6 h-6 text-yellow-600 mt-1"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-yellow-800 font-semibold mb-2">
                      💡 예문을 확인해보세요!
                    </p>
                    <p className="text-yellow-700 text-lg italic leading-relaxed">
                      "{question.word.example}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 다음 문제 안내 */}
            <div className="mt-6 text-center">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <p className="text-blue-700 font-semibold">
                  🚀 3초 후 자동으로 다음 문제로 이동해요!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
