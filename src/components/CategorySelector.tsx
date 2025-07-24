import React from "react";
import { BookOpen, Users, Briefcase, GraduationCap } from "lucide-react";
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

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  onCategorySelect,
  onAllCategoriesSelect,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          영어 단어 퀴즈
        </h1>
        <p className="text-lg text-gray-600">학습할 카테고리를 선택해주세요</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 전체 카테고리 버튼 */}
        <button
          onClick={onAllCategoriesSelect}
          className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <div className="flex flex-col items-center">
            <Users className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">전체 단어</h3>
            <p className="text-purple-100 text-sm mb-3">
              모든 카테고리의 단어들
            </p>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              {categories.reduce((total, cat) => total + cat.words.length, 0)}개
              단어
            </span>
          </div>
        </button>

        {/* 각 카테고리 버튼 */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className="bg-white border-2 border-gray-200 hover:border-blue-300 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-blue-500 group-hover:text-blue-600 mb-4">
                {categoryIcons[category.id] || categoryIcons.default}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {category.name}
              </h3>

              {category.description && (
                <p className="text-gray-600 text-sm mb-3">
                  {category.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  {category.words.length}개 단어
                </span>

                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Easy:{" "}
                  {category.words.filter((w) => w.difficulty === "easy").length}
                </span>

                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Medium:{" "}
                  {
                    category.words.filter((w) => w.difficulty === "medium")
                      .length
                  }
                </span>

                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  Hard:{" "}
                  {category.words.filter((w) => w.difficulty === "hard").length}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
