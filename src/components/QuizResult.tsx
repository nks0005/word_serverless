import React from "react";
import { Trophy, RotateCcw, Home, BookOpen } from "lucide-react";
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

  const getScoreColor = () => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getMotivationalMessage = () => {
    if (score >= 90) return "완벽해요! 🎉";
    if (score >= 80) return "훌륭합니다! 👏";
    if (score >= 70) return "잘했어요! 👍";
    if (score >= 60) return "조금 더 화이팅! 💪";
    return "다시 도전해보세요! 🔥";
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        {/* 헤더 */}
        <div className="mb-8">
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${getScoreColor()}`} />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">퀴즈 완료!</h1>
          <p className="text-lg text-gray-600">{getMotivationalMessage()}</p>
        </div>

        {/* 점수 표시 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm text-gray-500 font-medium mb-2">점수</h3>
            <div className={`text-4xl font-bold ${getScoreColor()}`}>
              {score}점
            </div>
            <div className="text-lg text-gray-600 mt-1">({grade} 등급)</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm text-gray-500 font-medium mb-2">정답률</h3>
            <div className="text-4xl font-bold text-gray-800">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {Math.round((correctAnswers / totalQuestions) * 100)}% 정답
            </div>
          </div>
        </div>

        {/* 상세 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {correctAnswers}
            </div>
            <div className="text-gray-600">정답</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {wrongAnswers.length}
            </div>
            <div className="text-gray-600">오답</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{duration}초</div>
            <div className="text-gray-600">소요시간</div>
          </div>
        </div>

        {/* 오답 목록 */}
        {wrongAnswers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              틀린 문제들
            </h3>
            <div className="space-y-3">
              {wrongAnswers.slice(0, 3).map((answer, index) => {
                const question = session.questions.find(
                  (q) => q.id === answer.questionId
                );
                if (!question) return null;

                return (
                  <div
                    key={index}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {question.type === "english-to-korean"
                            ? question.word.english
                            : question.word.korean}
                        </p>
                        <p className="text-sm text-red-600">
                          선택: {answer.selectedAnswer}
                        </p>
                        <p className="text-sm text-green-600">
                          정답: {answer.correctAnswer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {wrongAnswers.length > 3 && (
                <p className="text-sm text-gray-500">
                  외 {wrongAnswers.length - 3}개 더...
                </p>
              )}
            </div>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={onRestart}
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              다시 풀기
            </button>

            <button
              onClick={onBackToHome}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              홈으로
            </button>
          </div>

          {wrongAnswers.length > 0 && (
            <button
              onClick={onReviewWrongAnswers}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              오답노트 ({wrongAnswers.length}개)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
