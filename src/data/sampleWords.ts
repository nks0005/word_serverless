import type { Category } from "../types/word";

export const sampleCategories: Category[] = [
  {
    id: "basic-vocabulary",
    name: "기초 어휘",
    description: "일상생활에서 자주 사용하는 기본 단어들",
    words: [
      {
        id: "house",
        english: "house",
        korean: "집",
        phonetic: "/haʊs/",
        frequency: 9,
        difficulty: "easy",
        example: "I live in a big house.",
      },
      {
        id: "water",
        english: "water",
        korean: "물",
        phonetic: "/ˈwɔːtər/",
        frequency: 10,
        difficulty: "easy",
        example: "I drink water every day.",
      },
      {
        id: "food",
        english: "food",
        korean: "음식",
        phonetic: "/fuːd/",
        frequency: 9,
        difficulty: "easy",
        example: "Korean food is delicious.",
      },
      {
        id: "book",
        english: "book",
        korean: "책",
        phonetic: "/bʊk/",
        frequency: 8,
        difficulty: "easy",
        example: "I read a book every night.",
      },
      {
        id: "friend",
        english: "friend",
        korean: "친구",
        phonetic: "/frend/",
        frequency: 9,
        difficulty: "easy",
        example: "She is my best friend.",
      },
    ],
  },
  {
    id: "school-life",
    name: "학교 생활",
    description: "학교와 관련된 어휘들",
    words: [
      {
        id: "teacher",
        english: "teacher",
        korean: "선생님",
        phonetic: "/ˈtiːtʃər/",
        frequency: 8,
        difficulty: "easy",
        example: "My teacher is very kind.",
      },
      {
        id: "student",
        english: "student",
        korean: "학생",
        phonetic: "/ˈstuːdənt/",
        frequency: 8,
        difficulty: "easy",
        example: "I am a high school student.",
      },
      {
        id: "classroom",
        english: "classroom",
        korean: "교실",
        phonetic: "/ˈklæsruːm/",
        frequency: 7,
        difficulty: "medium",
        example: "Our classroom is on the second floor.",
      },
      {
        id: "homework",
        english: "homework",
        korean: "숙제",
        phonetic: "/ˈhoʊmwɜːrk/",
        frequency: 7,
        difficulty: "medium",
        example: "I have a lot of homework today.",
      },
      {
        id: "examination",
        english: "examination",
        korean: "시험",
        phonetic: "/ɪɡˌzæməˈneɪʃən/",
        frequency: 6,
        difficulty: "hard",
        example: "The final examination is next week.",
      },
    ],
  },
  {
    id: "business-english",
    name: "비즈니스 영어",
    description: "직장에서 사용하는 전문 용어들",
    words: [
      {
        id: "meeting",
        english: "meeting",
        korean: "회의",
        phonetic: "/ˈmiːtɪŋ/",
        frequency: 8,
        difficulty: "medium",
        example: "We have a meeting at 2 PM.",
      },
      {
        id: "presentation",
        english: "presentation",
        korean: "발표",
        phonetic: "/ˌprezənˈteɪʃən/",
        frequency: 7,
        difficulty: "medium",
        example: "I will give a presentation tomorrow.",
      },
      {
        id: "deadline",
        english: "deadline",
        korean: "마감일",
        phonetic: "/ˈdɛdˌlaɪn/",
        frequency: 6,
        difficulty: "medium",
        example: "The project deadline is Friday.",
      },
      {
        id: "productivity",
        english: "productivity",
        korean: "생산성",
        phonetic: "/ˌproʊdʌkˈtɪvəti/",
        frequency: 5,
        difficulty: "hard",
        example: "We need to improve our productivity.",
      },
      {
        id: "collaboration",
        english: "collaboration",
        korean: "협업",
        phonetic: "/kəˌlæbəˈreɪʃən/",
        frequency: 5,
        difficulty: "hard",
        example: "Good collaboration leads to success.",
      },
    ],
  },
];

export const getAllWords = () => {
  return sampleCategories.flatMap((category) => category.words);
};

export const getWordsByDifficulty = (
  difficulty: "easy" | "medium" | "hard"
) => {
  return getAllWords().filter((word) => word.difficulty === difficulty);
};

export const getWordsByCategory = (categoryId: string) => {
  const category = sampleCategories.find((cat) => cat.id === categoryId);
  return category ? category.words : [];
};
