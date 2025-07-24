import React, { useState, useEffect } from "react";
import {
  Trophy,
  RotateCcw,
  Home,
  BookOpen,
  Star,
  Medal,
  Target,
} from "lucide-react";
import type { QuizSession } from "../types/word";
import { calculateScore, getScoreGrade } from "../utils/quizGenerator";

interface QuizResultProps {
  session: QuizSession;
  onRestart: () => void;
  onBackToHome: () => void;
  onReviewWrongAnswers: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  session,
  onRestart,
  onBackToHome,
  onReviewWrongAnswers,
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const correctAnswers = session.answers.filter(
    (answer) => answer.isCorrect
  ).length;
  const totalQuestions = session.questions.length;
  const score = calculateScore(totalQuestions, correctAnswers);
  const grade = getScoreGrade(score);
  const wrongAnswers = session.answers.filter((answer) => !answer.isCorrect);

  const duration = session.endTime
    ? Math.round(
        (session.endTime.getTime() - session.startTime.getTime()) / 1000
      )
    : 0;

  // 성취도에 따른 애니메이션 효과
  useEffect(() => {
    if (score >= 80) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [score]);

  const getScoreColor = () => {
    if (score >= 90) return "text-yellow-500"; // 금색
    if (score >= 80) return "text-blue-500"; // 은색
    if (score >= 70) return "text-orange-500"; // 동색
    if (score >= 60) return "text-green-500"; // 녹색
    return "text-gray-500";
  };

  const getScoreGradient = () => {
    if (score >= 90) return "from-yellow-400 to-yellow-600";
    if (score >= 80) return "from-blue-400 to-blue-600";
    if (score >= 70) return "from-orange-400 to-orange-600";
    if (score >= 60) return "from-green-400 to-green-600";
    return "from-gray-400 to-gray-600";
  };

  const getMotivationalMessage = () => {
    if (score >= 95)
      return {
        emoji: "🏆",
        title: "완벽한 천재!",
        message: "정말 대단해요! 모든 문제를 거의 맞혔어요!",
      };
    if (score >= 90)
      return {
        emoji: "🌟",
        title: "최고예요!",
        message: "놀라워요! 거의 완벽한 점수네요!",
      };
    if (score >= 80)
      return {
        emoji: "🎉",
        title: "훌륭해요!",
        message: "정말 잘했어요! 실력이 늘고 있어요!",
      };
    if (score >= 70)
      return {
        emoji: "👏",
        title: "잘했어요!",
        message: "좋은 결과예요! 계속 열심히 해봐요!",
      };
    if (score >= 60)
      return {
        emoji: "💪",
        title: "힘내세요!",
        message: "조금 더 연습하면 더 잘할 수 있어요!",
      };
    return {
      emoji: "🔥",
      title: "다시 도전!",
      message: "포기하지 마세요! 다시 도전하면 더 좋은 결과가 있을 거예요!",
    };
  };

  const getBadgeIcon = () => {
    if (score >= 90) return <Trophy className="w-8 h-8" />;
    if (score >= 80) return <Medal className="w-8 h-8" />;
    if (score >= 70) return <Star className="w-8 h-8" />;
    return <Target className="w-8 h-8" />;
  };

  const motivation = getMotivationalMessage();

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      {/* 축하 애니메이션 */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-animation">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: [
                    "#ffd700",
                    "#ff6b6b",
                    "#4ecdc4",
                    "#45b7d1",
                    "#6c5ce7",
                  ][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border-4 border-blue-100">
        {/* 헤더 */}
        <div className="mb-10">
          <div className="relative inline-block">
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${getScoreGradient()} flex items-center justify-center text-white shadow-lg`}
            >
              {getBadgeIcon()}
            </div>
            {score >= 90 && (
              <div className="absolute -top-2 -right-2 text-4xl animate-bounce">
                ✨
              </div>
            )}
          </div>

          <div className="text-6xl mb-4">{motivation.emoji}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            {motivation.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {motivation.message}
          </p>
        </div>

        {/* 메인 점수 표시 */}
        <div className="mb-10">
          <div
            className={`text-8xl font-bold mb-4 bg-gradient-to-r ${getScoreGradient()} bg-clip-text text-transparent`}
          >
            {score}점
          </div>
          <div className="text-2xl text-gray-600 font-semibold">
            {grade} 등급 🏅
          </div>
        </div>

        {/* 상세 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* 정답률 카드 */}
          <div className="bg-green-50 border-3 border-green-200 rounded-3xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-green-800 font-bold text-lg mb-2">정답률</h3>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {Math.round((correctAnswers / totalQuestions) * 100)}%
            </div>
            <div className="text-green-600">
              {correctAnswers}개 / {totalQuestions}개
            </div>
          </div>

          {/* 소요시간 카드 */}
          <div className="bg-blue-50 border-3 border-blue-200 rounded-3xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">⏱️</div>
            <h3 className="text-blue-800 font-bold text-lg mb-2">소요시간</h3>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {Math.floor(duration / 60)}분 {duration % 60}초
            </div>
            <div className="text-blue-600">
              평균 {Math.round(duration / totalQuestions)}초/문제
            </div>
          </div>

          {/* 틀린 문제 카드 */}
          <div className="bg-orange-50 border-3 border-orange-200 rounded-3xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-orange-800 font-bold text-lg mb-2">
              복습할 단어
            </h3>
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {wrongAnswers.length}개
            </div>
            <div className="text-orange-600">
              {wrongAnswers.length === 0
                ? "완벽해요!"
                : "오답노트에서 복습하세요"}
            </div>
          </div>
        </div>

        {/* 성과 분석 */}
        <div className="mb-10">
          <div className="bg-gray-50 rounded-3xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📊 나의 학습 성과
            </h3>

            {/* 진행 바 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">정답률</span>
                <span className="font-semibold text-gray-800">
                  {Math.round((correctAnswers / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full bg-gradient-to-r ${getScoreGradient()} transition-all duration-1000 ease-out`}
                  style={{
                    width: `${(correctAnswers / totalQuestions) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 격려 메시지 */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  +{correctAnswers}
                </div>
                <div className="text-gray-600">맞힌 문제 🎉</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {Math.round(((correctAnswers / totalQuestions) * 100) / 10)}★
                </div>
                <div className="text-gray-600">획득한 별 ⭐</div>
              </div>
            </div>
          </div>
        </div>

        {/* 오답 목록 - 더 시각적으로 */}
        {wrongAnswers.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
              <span>📚</span>
              다시 확인해볼 단어들
            </h3>
            <div className="grid gap-4 max-h-80 overflow-y-auto">
              {wrongAnswers.slice(0, 5).map((answer, index) => {
                const question = session.questions.find(
                  (q) => q.id === answer.questionId
                );
                if (!question) return null;

                return (
                  <div
                    key={index}
                    className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-left hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">
                            {question.type === "english-to-korean"
                              ? "🇺🇸"
                              : "🇰🇷"}
                          </span>
                          <h4 className="font-bold text-lg text-gray-800">
                            {question.type === "english-to-korean"
                              ? question.word.english
                              : question.word.korean}
                          </h4>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 font-semibold">
                              ❌ 선택:
                            </span>
                            <span className="text-red-700">
                              {answer.selectedAnswer}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 font-semibold">
                              ✅ 정답:
                            </span>
                            <span className="text-green-700 font-semibold">
                              {answer.correctAnswer}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {wrongAnswers.length > 5 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-lg">
                    외 {wrongAnswers.length - 5}개 더 있어요...
                    <br />
                    <span className="text-blue-600 font-semibold">
                      오답노트에서 모두 확인하세요! 📖
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 액션 버튼들 - 더 눈에 띄게 */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={onRestart}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-6 h-6" />
              같은 문제 다시 풀기 🔄
            </button>

            <button
              onClick={onBackToHome}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
            >
              <Home className="w-6 h-6" />
              다른 카테고리 도전 🏠
            </button>
          </div>

          {wrongAnswers.length > 0 && (
            <button
              onClick={onReviewWrongAnswers}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
            >
              <BookOpen className="w-6 h-6" />
              📚 오답노트로 복습하기 ({wrongAnswers.length}개 단어)
            </button>
          )}
        </div>

        {/* 격려 메시지 */}
        <div className="mt-10 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl border-2 border-purple-200">
          <div className="text-2xl mb-3">🌟</div>
          <h3 className="text-lg font-bold text-purple-800 mb-2">
            {score >= 80 ? "정말 잘했어요!" : "계속 열심히 해봐요!"}
          </h3>
          <p className="text-purple-700">
            {score >= 80
              ? "이런 실력이면 영어 단어 마스터가 될 수 있어요! 🏆"
              : "매일 조금씩 연습하면 실력이 쑥쑥 늘어날 거예요! 💪"}
          </p>
        </div>
      </div>
    </div>
  );
};
