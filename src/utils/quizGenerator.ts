import type { Word, QuizQuestion, QuizMode } from "../types/word";

export const generateQuizQuestions = (
  words: Word[],
  mode: QuizMode = "mixed",
  questionCount: number = 10
): QuizQuestion[] => {
  if (words.length === 0) return [];

  const shuffledWords = [...words].sort(() => Math.random() - 0.5);
  const selectedWords = shuffledWords.slice(
    0,
    Math.min(questionCount, words.length)
  );

  return selectedWords.map((word, index) => {
    const questionType =
      mode === "mixed"
        ? Math.random() > 0.5
          ? "english-to-korean"
          : "korean-to-english"
        : mode;

    const options = generateOptions(word, words, questionType);
    const correctAnswer =
      questionType === "english-to-korean" ? word.korean : word.english;

    return {
      id: `question-${index}`,
      type: questionType,
      word,
      options,
      correctAnswer,
    };
  });
};

const generateOptions = (
  targetWord: Word,
  allWords: Word[],
  questionType: "english-to-korean" | "korean-to-english"
): string[] => {
  const correctAnswer =
    questionType === "english-to-korean"
      ? targetWord.korean
      : targetWord.english;

  // 다른 단어들에서 오답 선택지 생성
  const otherWords = allWords.filter((word) => word.id !== targetWord.id);
  const wrongOptions = otherWords
    .map((word) =>
      questionType === "english-to-korean" ? word.korean : word.english
    )
    .filter((option) => option !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // 정답과 오답을 섞어서 반환
  const allOptions = [correctAnswer, ...wrongOptions];
  return allOptions.sort(() => Math.random() - 0.5);
};

export const calculateScore = (
  totalQuestions: number,
  correctAnswers: number
): number => {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
};

export const getScoreGrade = (score: number): string => {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getRandomWords = (words: Word[], count: number): Word[] => {
  if (words.length <= count) return words;
  return shuffleArray(words).slice(0, count);
};
