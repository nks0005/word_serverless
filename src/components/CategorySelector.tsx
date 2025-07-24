import React from "react";
import {
  BookOpen,
  Users,
  Briefcase,
  GraduationCap,
  Star,
  Sparkles,
} from "lucide-react";
import type { Category } from "../types/word";

interface CategorySelectorProps {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
  onAllCategoriesSelect: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  "basic-vocabulary": <BookOpen className="w-8 h-8" />,
  "school-life": <GraduationCap className="w-8 h-8" />,
  "business-english": <Briefcase className="w-8 h-8" />,
  default: <Users className="w-8 h-8" />,
};

// 카테고리별 이모지와 색상 테마
const categoryThemes: Record<
  string,
  { emoji: string; gradient: string; bgColor: string }
> = {
  "basic-vocabulary": {
    emoji: "📚",
    gradient: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
  },
  "school-life": {
    emoji: "🏫",
    gradient: "from-green-400 to-green-600",
    bgColor: "bg-green-50",
  },
  "business-english": {
    emoji: "💼",
    gradient: "from-indigo-400 to-indigo-600",
    bgColor: "bg-indigo-50",
  },
  default: {
    emoji: "🎯",
    gradient: "from-gray-400 to-gray-600",
    bgColor: "bg-gray-50",
  },
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  onCategorySelect,
  onAllCategoriesSelect,
}) => {
  const totalWords = categories.reduce(
    (total, cat) => total + cat.words.length,
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 더 친근한 헤더 */}
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 relative">
            🌟 영어 단어 퀴즈 🌟
          </h1>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <p className="text-xl text-gray-600 mb-4">
          어떤 단어들을 공부해볼까요? 🤔
        </p>
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-lg font-semibold">
          <Star className="w-5 h-5" />총 {totalWords}개의 재미있는 단어들이
          기다리고 있어요!
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* 전체 카테고리 버튼 - 더 눈에 띄게 */}
        <div className="md:col-span-2 lg:col-span-3">
          <button
            onClick={onAllCategoriesSelect}
            className="w-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000"></div>
            <div className="flex flex-col items-center relative z-10">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold mb-3">모든 단어에 도전!</h3>
              <p className="text-purple-100 text-lg mb-4">
                모든 카테고리의 단어들을 섞어서 공부해요
              </p>
              <div className="bg-white bg-opacity-30 backdrop-blur-sm px-6 py-3 rounded-full text-xl font-bold">
                🚀 {totalWords}개 단어와 함께!
              </div>
            </div>
          </button>
        </div>

        {/* 각 카테고리 버튼 - 더 친근하고 시각적으로 */}
        {categories.map((category) => {
          const theme = categoryThemes[category.id] || categoryThemes.default;

          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`${theme.bgColor} border-3 border-transparent hover:border-blue-300 p-8 rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

              <div className="flex flex-col items-center text-center relative z-10">
                {/* 이모지와 아이콘 조합 */}
                <div className="flex items-center justify-center mb-6">
                  <div className="text-5xl mr-3">{theme.emoji}</div>
                  <div
                    className={`text-white bg-gradient-to-br ${theme.gradient} p-3 rounded-2xl group-hover:rotate-12 transition-transform duration-300`}
                  >
                    {categoryIcons[category.id] || categoryIcons.default}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>

                {category.description && (
                  <p className="text-gray-600 text-base mb-4 leading-relaxed">
                    {category.description}
                  </p>
                )}

                {/* 더 시각적인 단어 수 표시 */}
                <div className="mb-6">
                  <div
                    className={`bg-gradient-to-r ${theme.gradient} text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg`}
                  >
                    📝 {category.words.length}개 단어
                  </div>
                </div>

                {/* 호버시 보이는 응원 메시지 */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-blue-600 font-semibold text-lg">
                    🎯 클릭해서 시작해보세요!
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 추가 안내 메시지 */}
      <div className="text-center mt-12">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-blue-800 mb-3">
            💡 퀴즈 진행 방법
          </h3>
          <div className="text-blue-700 space-y-2">
            <p>• 각 문제마다 30초의 시간이 주어져요</p>
            <p>• 틀린 문제는 오답노트에 자동으로 저장돼요</p>
            <p>• 언제든지 오답노트로 복습할 수 있어요</p>
          </div>
        </div>
      </div>
    </div>
  );
};
