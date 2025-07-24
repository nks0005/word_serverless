import type { Category } from '../types/word';

export const sampleCategories: Category[] = [
  {
    "id": "excel-category-1753374517677-7lw1atitb",
    "name": "일상회화",
    "description": "엑셀 파일에서 가져온 카테고리 (6개 단어)",
    "words": [
      {
        "id": "excel-word-1753374517676-0",
        "english": "hello",
        "korean": "안녕하세요",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-1",
        "english": "goodbye",
        "korean": "안녕히 가세요",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-2",
        "english": "thank you",
        "korean": "감사합니다",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-3",
        "english": "hello",
        "korean": "안녕하세요",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-4",
        "english": "goodbye",
        "korean": "안녕히 가세요",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-5",
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
    "id": "excel-category-1753374517677-zlal0ev8h",
    "name": "비즈니스",
    "description": "엑셀 파일에서 가져온 카테고리 (4개 단어)",
    "words": [
      {
        "id": "excel-word-1753374517676-6",
        "english": "meeting",
        "korean": "회의",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-7",
        "english": "presentation",
        "korean": "발표",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-8",
        "english": "meeting",
        "korean": "회의",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-9",
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
    "id": "excel-category-1753374517677-3ii3h7q9b",
    "name": "음식",
    "description": "엑셀 파일에서 가져온 카테고리 (6개 단어)",
    "words": [
      {
        "id": "excel-word-1753374517676-10",
        "english": "apple",
        "korean": "사과",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-11",
        "english": "banana",
        "korean": "바나나",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-12",
        "english": "coffee",
        "korean": "커피",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-13",
        "english": "apple",
        "korean": "사과",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-14",
        "english": "banana",
        "korean": "바나나",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "excel-word-1753374517676-15",
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