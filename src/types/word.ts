export interface Word {
  id: string;
  english: string;
  korean: string;
  phonetic?: string; // 발음 기호
  frequency: number; // 단어 빈도 (1-10, 높을수록 자주 사용)
  difficulty: "easy" | "medium" | "hard";
  example?: string; // 예문
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  words: Word[];
}

export interface QuizQuestion {
  id: string;
  type: "english-to-korean" | "korean-to-english";
  word: Word;
  options: string[];
  correctAnswer: string;
}

export interface QuizSession {
  id: string;
  categoryId: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  startTime: Date;
  endTime?: Date;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // milliseconds
}

export interface UserProgress {
  totalQuizzesCompleted: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  categoryProgress: Record<string, CategoryProgress>;
  wrongAnswers: Word[]; // 오답노트
  lastStudiedWords: Word[];
}

export interface CategoryProgress {
  categoryId: string;
  quizzesCompleted: number;
  bestScore: number;
  averageScore: number;
  masteredWords: string[]; // word IDs
}

export type QuizMode = "mixed" | "english-to-korean" | "korean-to-english";
export type Difficulty = "easy" | "medium" | "hard" | "mixed";
