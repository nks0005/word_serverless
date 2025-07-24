import type { Category } from '../types/word';

export const sampleCategories: Category[] = [
  {
    "id": "id-1753372246311-4zdny3jim",
    "name": "테스트",
    "description": "테스트",
    "words": [
      {
        "id": "id-1753372265187-0i70954v6",
        "english": "test",
        "korean": "테스트",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "id-1753372484403-8l687g7ec",
        "english": "TEST2",
        "korean": "테스트",
        "phonetic": "",
        "frequency": 5,
        "difficulty": "medium",
        "example": ""
      },
      {
        "id": "id-1753372540862-kr05zrcje",
        "english": "ALL",
        "korean": "테스트",
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