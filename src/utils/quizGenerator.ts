import type { Word, QuizQuestion, QuizMode } from "../types/word";

export const generateQuizQuestions = (
  words: Word[],
  _mode: QuizMode = "english-to-korean", // _ prefix로 사용하지 않음을 표시
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
    const options = generateOptions(word, words, "english-to-korean");
    const correctAnswer = word.korean;

    return {
      id: `question-${index}`,
      type: "english-to-korean",
      word,
      options,
      correctAnswer,
    };
  });
};

const generateOptions = (
  targetWord: Word,
  allWords: Word[],
  _questionType: "english-to-korean" | "korean-to-english" // _ prefix로 사용하지 않음을 표시
): string[] => {
  const correctAnswer = targetWord.korean;

  // 다른 단어들에서 한국어 오답 선택지 생성 (중복 제거)
  const otherWords = allWords.filter((word) => word.id !== targetWord.id);

  // 중복되는 한국어 뜻 제거 - Set을 사용해서 고유한 한국어만 추출
  const uniqueKoreanOptions = Array.from(
    new Set(
      otherWords
        .map((word) => word.korean)
        .filter((option) => option !== correctAnswer)
    )
  );

  // 고유한 선택지를 섞고 최대 4개까지 선택
  const wrongOptions = uniqueKoreanOptions
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  // 만약 고유한 오답이 4개 미만이면, 부족한 만큼 일반적인 단어로 채우기
  const commonWrongAnswers = [
    "사과",
    "책",
    "물",
    "집",
    "차",
    "음식",
    "사람",
    "시간",
    "학교",
    "친구",
    "가족",
    "일",
    "돈",
    "길",
    "나무",
    "꽃",
    "하늘",
    "바다",
    "산",
    "강",
  ];

  // 현재 선택지에 없는 일반적인 단어들로 부족한 선택지 채우기
  const allCurrentOptions = [correctAnswer, ...wrongOptions];
  const additionalOptions = commonWrongAnswers
    .filter((option) => !allCurrentOptions.includes(option))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4 - wrongOptions.length);

  const finalWrongOptions = [...wrongOptions, ...additionalOptions];

  // 정답과 오답을 섞어서 반환 (총 5개)
  const allOptions = [correctAnswer, ...finalWrongOptions];
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
