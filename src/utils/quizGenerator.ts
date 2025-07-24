import type { Word, QuizQuestion, QuizMode } from "../types/word";

export const generateQuizQuestions = (
  words: Word[],
  mode: QuizMode = "english-to-korean", // 기본값을 영어->한국어로 변경
  questionCount: number = 10
): QuizQuestion[] => {
  if (words.length === 0) return [];

  const shuffledWords = [...words].sort(() => Math.random() - 0.5);
  const selectedWords = shuffledWords.slice(
    0,
    Math.min(questionCount, words.length)
  );

  return selectedWords.map((word, index) => {
    // 항상 영어 -> 한국어 퀴즈만 생성
    const questionType = "english-to-korean";

    const options = generateOptions(word, words, questionType);
    const correctAnswer = word.korean;

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
  const correctAnswer = targetWord.korean;

  // 다른 단어들에서 한국어 오답 선택지 생성 (4개)
  const otherWords = allWords.filter((word) => word.id !== targetWord.id);
  const wrongOptions = otherWords
    .map((word) => word.korean)
    .filter((option) => option !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4); // 4개의 오답 선택지

  // 정답과 오답을 섞어서 반환 (총 5개)
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
