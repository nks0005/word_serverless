import type { Category } from '../types/word';

export const sampleCategories: Category[] = [
  {
    "id": "excel-category-1753373891892-xhdv9or6d",
    "name": "테스트",
    "description": "엑셀 파일에서 가져온 카테고리 (4개 단어)",
    "words": [
      {
        "id": "excel-word-1753373891891-0",
        "english": "test",
        "korean": "테스트",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-1",
        "english": "TEST2",
        "korean": "테스트",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-2",
        "english": "ALL",
        "korean": "테스트",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-19",
        "english": "TEST",
        "korean": "테스트",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      }
    ]
  },
  {
    "id": "excel-category-1753373891892-q429yk5gp",
    "name": "일상회화",
    "description": "엑셀 파일에서 가져온 카테고리 (6개 단어)",
    "words": [
      {
        "id": "excel-word-1753373891891-3",
        "english": "hello",
        "korean": "안녕하세요",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-4",
        "english": "goodbye",
        "korean": "안녕히 가세요",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-5",
        "english": "thank you",
        "korean": "감사합니다",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-6",
        "english": "hello",
        "korean": "안녕하세요",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-7",
        "english": "goodbye",
        "korean": "안녕히 가세요",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-8",
        "english": "thank you",
        "korean": "감사합니다",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      }
    ]
  },
  {
    "id": "excel-category-1753373891892-lpgm8u78h",
    "name": "비즈니스",
    "description": "엑셀 파일에서 가져온 카테고리 (4개 단어)",
    "words": [
      {
        "id": "excel-word-1753373891891-9",
        "english": "meeting",
        "korean": "회의",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-10",
        "english": "presentation",
        "korean": "발표",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-11",
        "english": "meeting",
        "korean": "회의",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-12",
        "english": "presentation",
        "korean": "발표",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      }
    ]
  },
  {
    "id": "excel-category-1753373891892-5gzpjw7jx",
    "name": "음식",
    "description": "엑셀 파일에서 가져온 카테고리 (6개 단어)",
    "words": [
      {
        "id": "excel-word-1753373891891-13",
        "english": "apple",
        "korean": "사과",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-14",
        "english": "banana",
        "korean": "바나나",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-15",
        "english": "coffee",
        "korean": "커피",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-16",
        "english": "apple",
        "korean": "사과",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-17",
        "english": "banana",
        "korean": "바나나",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753373891891-18",
        "english": "coffee",
        "korean": "커피",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      }
    ]
  }
];

export const getAllWords = () => {
  return sampleCategories.flatMap(category => category.words);
};

export const getWordsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
  return getAllWords().filter(word => word.difficulty === difficulty);
};

export const getWordsByCategory = (categoryId: string) => {
  const category = sampleCategories.find(cat => cat.id === categoryId);
  return category ? category.words : [];
};