import React, { useState } from "react";
import { Plus, Edit, Trash2, Save, X, Download, Upload } from "lucide-react";
import type { Category, Word } from "../types/word";

interface WordEditorProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  onClose: () => void;
}

export const WordEditor: React.FC<WordEditorProps> = ({
  categories,
  onUpdateCategories,
  onClose,
}) => {
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [_editingCategory, _setEditingCategory] = useState<Category | null>(
    null
  );
  const [showAddWord, setShowAddWord] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // 새 단어 폼
  const [newWord, setNewWord] = useState<Partial<Word>>({
    english: "",
    korean: "",
    phonetic: "",
    frequency: 5,
    difficulty: "medium",
    example: "",
  });

  // 새 카테고리 폼
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    description: "",
    words: [],
  });

  const generateId = () =>
    `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddWord = () => {
    if (!newWord.english || !newWord.korean || !selectedCategoryId) return;

    const word: Word = {
      id: generateId(),
      english: newWord.english,
      korean: newWord.korean,
      phonetic: newWord.phonetic || "",
      frequency: newWord.frequency || 5,
      difficulty: newWord.difficulty || "medium",
      example: newWord.example || "",
    };

    const updatedCategories = categories.map((cat) =>
      cat.id === selectedCategoryId
        ? { ...cat, words: [...cat.words, word] }
        : cat
    );

    onUpdateCategories(updatedCategories);
    setNewWord({
      english: "",
      korean: "",
      phonetic: "",
      frequency: 5,
      difficulty: "medium",
      example: "",
    });
    setShowAddWord(false);
  };

  const handleEditWord = (word: Word) => {
    const updatedCategories = categories.map((cat) => ({
      ...cat,
      words: cat.words.map((w) => (w.id === word.id ? word : w)),
    }));

    onUpdateCategories(updatedCategories);
    setEditingWord(null);
  };

  const handleDeleteWord = (wordId: string) => {
    if (!confirm("정말 이 단어를 삭제하시겠습니까?")) return;

    const updatedCategories = categories.map((cat) => ({
      ...cat,
      words: cat.words.filter((w) => w.id !== wordId),
    }));

    onUpdateCategories(updatedCategories);
  };

  const handleAddCategory = () => {
    if (!newCategory.name) return;

    const category: Category = {
      id: generateId(),
      name: newCategory.name,
      description: newCategory.description || "",
      words: [],
    };

    onUpdateCategories([...categories, category]);
    setNewCategory({ name: "", description: "", words: [] });
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (
      !confirm(
        "정말 이 카테고리를 삭제하시겠습니까? 모든 단어가 함께 삭제됩니다."
      )
    )
      return;

    const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
    onUpdateCategories(updatedCategories);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(categories, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `word-data-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (
          Array.isArray(imported) &&
          imported.every(
            (cat) => cat.id && cat.name && Array.isArray(cat.words)
          )
        ) {
          onUpdateCategories(imported);
          alert("데이터를 성공적으로 가져왔습니다!");
        } else {
          alert("올바르지 않은 데이터 형식입니다.");
        }
      } catch (error) {
        alert("파일을 읽는 중 오류가 발생했습니다.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">단어 데이터 편집기</h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              내보내기
            </button>
            <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              가져오기
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* 카테고리 추가 버튼 */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddCategory(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />새 카테고리 추가
            </button>
          </div>

          {/* 카테고리별 단어 목록 */}
          {categories.map((category) => (
            <div key={category.id} className="mb-8 border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600">{category.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {category.words.length}개 단어
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                      setShowAddWord(true);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    단어 추가
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 단어 목록 */}
              <div className="grid gap-3">
                {category.words.map((word) => (
                  <div key={word.id} className="border rounded p-3 bg-gray-50">
                    {editingWord?.id === word.id ? (
                      <EditWordForm
                        word={editingWord}
                        onSave={handleEditWord}
                        onCancel={() => setEditingWord(null)}
                        onChange={setEditingWord}
                      />
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="font-bold text-lg">
                              {word.english}
                            </span>
                            <span className="text-gray-600">
                              {word.phonetic}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                word.difficulty === "easy"
                                  ? "bg-green-100 text-green-600"
                                  : word.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {word.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-800 mb-1">{word.korean}</p>
                          {word.example && (
                            <p className="text-sm text-gray-600 italic">
                              "{word.example}"
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingWord(word)}
                            className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWord(word.id)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 새 단어 추가 모달 */}
        {showAddWord && (
          <AddWordModal
            newWord={newWord}
            onChange={setNewWord}
            onAdd={handleAddWord}
            onCancel={() => setShowAddWord(false)}
          />
        )}

        {/* 새 카테고리 추가 모달 */}
        {showAddCategory && (
          <AddCategoryModal
            newCategory={newCategory}
            onChange={setNewCategory}
            onAdd={handleAddCategory}
            onCancel={() => setShowAddCategory(false)}
          />
        )}
      </div>
    </div>
  );
};

// 단어 편집 폼 컴포넌트
const EditWordForm: React.FC<{
  word: Word;
  onSave: (word: Word) => void;
  onCancel: () => void;
  onChange: (word: Word) => void;
}> = ({ word, onSave, onCancel, onChange }) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <input
        type="text"
        value={word.english}
        onChange={(e) => onChange({ ...word, english: e.target.value })}
        placeholder="영어 단어"
        className="border rounded px-3 py-2"
      />
      <input
        type="text"
        value={word.korean}
        onChange={(e) => onChange({ ...word, korean: e.target.value })}
        placeholder="한국어 뜻"
        className="border rounded px-3 py-2"
      />
    </div>
    <div className="grid grid-cols-3 gap-3">
      <input
        type="text"
        value={word.phonetic || ""}
        onChange={(e) => onChange({ ...word, phonetic: e.target.value })}
        placeholder="발음 기호"
        className="border rounded px-3 py-2"
      />
      <select
        value={word.difficulty}
        onChange={(e) =>
          onChange({ ...word, difficulty: e.target.value as any })
        }
        className="border rounded px-3 py-2"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <input
        type="number"
        value={word.frequency}
        onChange={(e) =>
          onChange({ ...word, frequency: parseInt(e.target.value) || 1 })
        }
        min="1"
        max="10"
        placeholder="빈도 (1-10)"
        className="border rounded px-3 py-2"
      />
    </div>
    <input
      type="text"
      value={word.example || ""}
      onChange={(e) => onChange({ ...word, example: e.target.value })}
      placeholder="예문"
      className="w-full border rounded px-3 py-2"
    />
    <div className="flex gap-2">
      <button
        onClick={() => onSave(word)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        저장
      </button>
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        취소
      </button>
    </div>
  </div>
);

// 새 단어 추가 모달
const AddWordModal: React.FC<{
  newWord: Partial<Word>;
  onChange: (word: Partial<Word>) => void;
  onAdd: () => void;
  onCancel: () => void;
}> = ({ newWord, onChange, onAdd, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <h3 className="text-lg font-bold mb-4">새 단어 추가</h3>
      <div className="space-y-3">
        <input
          type="text"
          value={newWord.english || ""}
          onChange={(e) => onChange({ ...newWord, english: e.target.value })}
          placeholder="영어 단어"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          value={newWord.korean || ""}
          onChange={(e) => onChange({ ...newWord, korean: e.target.value })}
          placeholder="한국어 뜻"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          value={newWord.phonetic || ""}
          onChange={(e) => onChange({ ...newWord, phonetic: e.target.value })}
          placeholder="발음 기호 (선택사항)"
          className="w-full border rounded px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={newWord.difficulty || "medium"}
            onChange={(e) =>
              onChange({ ...newWord, difficulty: e.target.value as any })
            }
            className="border rounded px-3 py-2"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <input
            type="number"
            value={newWord.frequency || 5}
            onChange={(e) =>
              onChange({ ...newWord, frequency: parseInt(e.target.value) || 1 })
            }
            min="1"
            max="10"
            placeholder="빈도"
            className="border rounded px-3 py-2"
          />
        </div>
        <input
          type="text"
          value={newWord.example || ""}
          onChange={(e) => onChange({ ...newWord, example: e.target.value })}
          placeholder="예문 (선택사항)"
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={onAdd}
          className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          추가
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        >
          취소
        </button>
      </div>
    </div>
  </div>
);

// 새 카테고리 추가 모달
const AddCategoryModal: React.FC<{
  newCategory: Partial<Category>;
  onChange: (category: Partial<Category>) => void;
  onAdd: () => void;
  onCancel: () => void;
}> = ({ newCategory, onChange, onAdd, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <h3 className="text-lg font-bold mb-4">새 카테고리 추가</h3>
      <div className="space-y-3">
        <input
          type="text"
          value={newCategory.name || ""}
          onChange={(e) => onChange({ ...newCategory, name: e.target.value })}
          placeholder="카테고리 이름"
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          value={newCategory.description || ""}
          onChange={(e) =>
            onChange({ ...newCategory, description: e.target.value })
          }
          placeholder="카테고리 설명 (선택사항)"
          className="w-full border rounded px-3 py-2 h-20"
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={onAdd}
          className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          추가
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        >
          취소
        </button>
      </div>
    </div>
  </div>
);
