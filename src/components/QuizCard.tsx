import React from "react";
import { Volume2, Clock } from "lucide-react";
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

  const getButtonStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option
        ? "bg-blue-500 text-white border-blue-500"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
    }

    if (option === question.correctAnswer) {
      return "bg-green-500 text-white border-green-500";
    }

    if (selectedAnswer === option && option !== question.correctAnswer) {
      return "bg-red-500 text-white border-red-500";
    }

    return "bg-gray-100 text-gray-500 border-gray-300";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* 타이머 */}
      {timeLeft !== undefined && (
        <div className="flex items-center justify-center mb-4">
          <Clock className="w-5 h-5 mr-2 text-gray-500" />
          <span
            className={`font-semibold ${
              timeLeft <= 10 ? "text-red-500" : "text-gray-700"
            }`}
          >
            {timeLeft}초
          </span>
        </div>
      )}

      {/* 문제 */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 mb-2">
          {question.type === "english-to-korean"
            ? "다음 영어 단어의 뜻은?"
            : "다음 뜻의 영어 단어는?"}
        </p>

        <div className="flex items-center justify-center gap-3">
          <h2 className="text-3xl font-bold text-gray-800">
            {getQuestionText()}
          </h2>

          {isSupported && (
            <button
              onClick={handleSpeak}
              disabled={isSpeaking}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
              title="발음 듣기"
            >
              <Volume2
                className={`w-5 h-5 text-blue-600 ${
                  isSpeaking ? "animate-pulse" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* 발음 기호 */}
        {question.word.phonetic && (
          <p className="text-gray-500 mt-2">{question.word.phonetic}</p>
        )}
      </div>

      {/* 선택지 */}
      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && onAnswerSelect(option)}
            disabled={showResult}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all duration-200
              ${getButtonStyle(option)}
              ${showResult ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <span className="font-medium">
              {String.fromCharCode(65 + index)}. {option}
            </span>
          </button>
        ))}
      </div>

      {/* 결과 표시 시 예문 보여주기 */}
      {showResult && question.word.example && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">예문:</p>
          <p className="text-gray-800 italic">"{question.word.example}"</p>
        </div>
      )}
    </div>
  );
};
