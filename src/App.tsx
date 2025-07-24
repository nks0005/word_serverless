import { useState, useEffect } from "react";
import type {
  Category,
  QuizSession,
  QuizAnswer,
  Word,
  QuizMode,
} from "./types/word";
import { CategorySelector } from "./components/CategorySelector";
import { QuizCard } from "./components/QuizCard";
import { QuizResult } from "./components/QuizResult";
import { WordEditor } from "./components/WordEditor";
import { sampleCategories } from "./data/sampleWords";
import { generateQuizQuestions } from "./utils/quizGenerator";
import { useLocalStorage } from "./hooks/useLocalStorage";

type AppState = "home" | "quiz" | "result" | "editor";

function App() {
  const [appState, setAppState] = useState<AppState>("home");
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(
    null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | undefined>(undefined);

  // 로컬 스토리지로 오답노트 저장
  const [wrongAnswers, setWrongAnswers] = useLocalStorage<Word[]>(
    "word-quiz-wrong-answers",
    []
  );

  // 단어 데이터 관리 (로컬 스토리지에 저장)
  const [categories, setCategories] = useLocalStorage<Category[]>(
    "word-quiz-categories",
    sampleCategories
  );

  // 개발 환경에서만 관리 페이지 활성화
  const isDevelopment = import.meta.env.DEV;

  // 타이머 관리
  useEffect(() => {
    if (
      appState === "quiz" &&
      timeLeft !== undefined &&
      timeLeft > 0 &&
      !showResult
    ) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      // 시간 초과시 자동으로 다음 문제
      handleNextQuestion();
    }
  }, [timeLeft, showResult, appState]);

  const startQuiz = (categoryId: string | null, mode: QuizMode = "mixed") => {
    const words = categoryId
      ? categories.find((cat) => cat.id === categoryId)?.words || []
      : categories.flatMap((cat) => cat.words);

    if (words.length === 0) {
      alert("해당 카테고리에 단어가 없습니다.");
      return;
    }

    const questions = generateQuizQuestions(words, mode, 10);

    const session: QuizSession = {
      id: `session-${Date.now()}`,
      categoryId: categoryId || "all",
      questions,
      currentQuestionIndex: 0,
      score: 0,
      startTime: new Date(),
      answers: [],
    };

    setCurrentSession(session);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30); // 30초 제한
    setAppState("quiz");
  };

  const handleAnswerSelect = (answer: string) => {
    if (!currentSession || showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);
    setTimeLeft(undefined); // 타이머 정지

    const currentQuestion = currentSession.questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    const quizAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent: 30 - (timeLeft || 0), // 사용한 시간 계산
    };

    // 틀린 답변이면 오답노트에 추가
    if (!isCorrect) {
      const word = currentQuestion.word;
      setWrongAnswers((prev) => {
        const exists = prev.some((w) => w.id === word.id);
        return exists ? prev : [...prev, word];
      });
    }

    setCurrentSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        answers: [...prev.answers, quizAnswer],
        score: prev.score + (isCorrect ? 1 : 0),
      };
    });

    // 3초 후 다음 문제로 이동
    setTimeout(() => {
      handleNextQuestion();
    }, 3000);
  };

  const handleNextQuestion = () => {
    if (!currentSession) return;

    if (currentQuestionIndex + 1 >= currentSession.questions.length) {
      // 퀴즈 완료
      setCurrentSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          endTime: new Date(),
        };
      });
      setAppState("result");
    } else {
      // 다음 문제로
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    }
  };

  const handleRestart = () => {
    if (currentSession) {
      startQuiz(
        currentSession.categoryId === "all" ? null : currentSession.categoryId
      );
    }
  };

  const handleBackToHome = () => {
    setAppState("home");
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(undefined);
  };

  const handleReviewWrongAnswers = () => {
    if (wrongAnswers.length === 0) {
      alert("오답노트가 비어있습니다.");
      return;
    }

    const questions = generateQuizQuestions(
      wrongAnswers,
      "mixed",
      wrongAnswers.length
    );

    const session: QuizSession = {
      id: `review-session-${Date.now()}`,
      categoryId: "wrong-answers",
      questions,
      currentQuestionIndex: 0,
      score: 0,
      startTime: new Date(),
      answers: [],
    };

    setCurrentSession(session);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
    setAppState("quiz");
  };

  // 렌더링
  if (appState === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <CategorySelector
          categories={categories}
          onCategorySelect={(categoryId) => startQuiz(categoryId)}
          onAllCategoriesSelect={() => startQuiz(null)}
        />

        {/* 관리자 버튼 (개발 모드에서만) */}
        {isDevelopment && (
          <div className="max-w-4xl mx-auto px-6 pb-6">
            <button
              onClick={() => setAppState("editor")}
              className="w-full bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              ⚙️ 단어 데이터 편집하기 (개발 전용)
            </button>
          </div>
        )}

        {/* 오답노트 버튼 */}
        {wrongAnswers.length > 0 && (
          <div className="max-w-4xl mx-auto px-6 pb-6">
            <button
              onClick={handleReviewWrongAnswers}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-3xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
            >
              <span className="text-xl">📚</span>
              오답노트 복습하기 ({wrongAnswers.length}개 단어)
              <span className="text-xl">🔥</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (appState === "quiz" && currentSession) {
    const currentQuestion = currentSession.questions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        {/* 진행률 표시 */}
        <div className="max-w-3xl mx-auto mb-8 px-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-blue-100">
            {/* 상단 정보 */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {currentQuestionIndex + 1}
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-700">
                    문제 {currentQuestionIndex + 1} /{" "}
                    {currentSession.questions.length}
                  </span>
                  <div className="text-sm text-gray-500">
                    {currentSession.categoryId === "all"
                      ? "전체 단어"
                      : "카테고리별"}{" "}
                    퀴즈
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  🎯 {currentSession.score}점
                </div>
                <div className="text-sm text-gray-500">
                  정답률{" "}
                  {Math.round(
                    (currentSession.score /
                      (currentQuestionIndex + (showResult ? 1 : 0))) *
                      100
                  ) || 0}
                  %
                </div>
              </div>
            </div>

            {/* 진행률 바 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  진행률
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round(
                    ((currentQuestionIndex + (showResult ? 1 : 0)) /
                      currentSession.questions.length) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out relative"
                  style={{
                    width: `${
                      ((currentQuestionIndex + (showResult ? 1 : 0)) /
                        currentSession.questions.length) *
                      100
                    }%`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 성과 요약 */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="bg-green-50 rounded-2xl p-3 border border-green-200">
                <div className="text-green-600 font-bold text-lg">
                  {currentSession.score}
                </div>
                <div className="text-green-700">맞힌 문제 ✅</div>
              </div>
              <div className="bg-red-50 rounded-2xl p-3 border border-red-200">
                <div className="text-red-600 font-bold text-lg">
                  {currentQuestionIndex +
                    (showResult ? 1 : 0) -
                    currentSession.score}
                </div>
                <div className="text-red-700">틀린 문제 ❌</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-3 border border-blue-200">
                <div className="text-blue-600 font-bold text-lg">
                  {currentSession.questions.length -
                    (currentQuestionIndex + (showResult ? 1 : 0))}
                </div>
                <div className="text-blue-700">남은 문제 ⏳</div>
              </div>
            </div>
          </div>
        </div>

        <QuizCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          showResult={showResult}
          timeLeft={timeLeft}
        />
      </div>
    );
  }

  if (appState === "result" && currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <QuizResult
          session={currentSession}
          onRestart={handleRestart}
          onBackToHome={handleBackToHome}
          onReviewWrongAnswers={handleReviewWrongAnswers}
        />
      </div>
    );
  }

  // 관리 페이지 (개발 모드에서만)
  if (appState === "editor" && isDevelopment) {
    return (
      <WordEditor
        categories={categories}
        onUpdateCategories={setCategories}
        onClose={() => setAppState("home")}
      />
    );
  }

  return <div>Loading...</div>;
}

export default App;
