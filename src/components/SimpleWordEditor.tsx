import React, { useState } from "react";
import { Copy, Plus, Trash2 } from "lucide-react";
import type { Word } from "../types/word";

interface SimpleWordEditorProps {
  onClose: () => void;
}

export const SimpleWordEditor: React.FC<SimpleWordEditorProps> = ({
  onClose,
}) => {
  const [words, setWords] = useState<Partial<Word>[]>([
    {
      id: "",
      english: "",
      korean: "",
      phonetic: "",
      frequency: 5,
      difficulty: "medium",
      example: "",
    },
  ]);

  const addWord = () => {
    setWords([
      ...words,
      {
        id: "",
        english: "",
        korean: "",
        phonetic: "",
        frequency: 5,
        difficulty: "medium",
        example: "",
      },
    ]);
  };

  const removeWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const updateWord = (
    index: number,
    field: keyof Word,
    value: string | number
  ) => {
    const newWords = [...words];
    newWords[index] = { ...newWords[index], [field]: value };
    setWords(newWords);
  };

  const generateId = (english: string) => {
    return english
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const generateJSON = () => {
    const validWords = words.filter((word) => word.english && word.korean);
    return validWords.map((word) => ({
      ...word,
      id: word.id || generateId(word.english || ""),
      frequency: Number(word.frequency) || 5,
    }));
  };

  const copyToClipboard = () => {
    const json = JSON.stringify(generateJSON(), null, 2);
    navigator.clipboard.writeText(json);
    alert(
      "📋 JSON이 클립보드에 복사되었습니다!\n\nGitHub에서 파일을 편집할 때 붙여넣기 하세요."
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              🌐 온라인 단어 편집기
            </h2>
            <p className="text-gray-600">
              GitHub에 붙여넣기할 JSON 코드를 생성합니다
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            닫기
          </button>
        </div>

        <div className="p-6">
          {/* 안내 메시지 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-blue-800 mb-2">📋 사용 방법</h3>
            <ol className="text-blue-700 text-sm space-y-1">
              <li>1. 아래에서 단어들을 입력하세요</li>
              <li>2. "JSON 복사" 버튼을 클릭하세요</li>
              <li>
                3.{" "}
                <a
                  href="https://github.com/anhyoungbin/word_serverless/blob/main/src/data/sampleWords.ts"
                  target="_blank"
                  className="underline"
                >
                  GitHub 파일
                </a>
                을 열어서 편집하세요
              </li>
              <li>4. 기존 단어 배열에 복사한 JSON을 추가하세요</li>
            </ol>
          </div>

          {/* 단어 입력 폼들 */}
          <div className="space-y-6">
            {words.map((word, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold">단어 #{index + 1}</h4>
                  {words.length > 1 && (
                    <button
                      onClick={() => removeWord(index)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      영어 단어 *
                    </label>
                    <input
                      type="text"
                      value={word.english || ""}
                      onChange={(e) => {
                        updateWord(index, "english", e.target.value);
                        if (!word.id) {
                          updateWord(index, "id", generateId(e.target.value));
                        }
                      }}
                      placeholder="예: apple"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      한국어 뜻 *
                    </label>
                    <input
                      type="text"
                      value={word.korean || ""}
                      onChange={(e) =>
                        updateWord(index, "korean", e.target.value)
                      }
                      placeholder="예: 사과"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID (자동생성)
                    </label>
                    <input
                      type="text"
                      value={word.id || ""}
                      onChange={(e) => updateWord(index, "id", e.target.value)}
                      placeholder="자동 생성됨"
                      className="w-full border rounded px-3 py-2 bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      난이도
                    </label>
                    <select
                      value={word.difficulty || "medium"}
                      onChange={(e) =>
                        updateWord(index, "difficulty", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      빈도 (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={word.frequency || 5}
                      onChange={(e) =>
                        updateWord(index, "frequency", parseInt(e.target.value))
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      발음 기호 (선택사항)
                    </label>
                    <input
                      type="text"
                      value={word.phonetic || ""}
                      onChange={(e) =>
                        updateWord(index, "phonetic", e.target.value)
                      }
                      placeholder="예: /ˈæpəl/"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      예문 (선택사항)
                    </label>
                    <input
                      type="text"
                      value={word.example || ""}
                      onChange={(e) =>
                        updateWord(index, "example", e.target.value)
                      }
                      placeholder="예: I eat an apple."
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={addWord}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              단어 추가
            </button>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
            >
              <Copy className="w-4 h-4" />
              JSON 복사 📋
            </button>
          </div>

          {/* JSON 미리보기 */}
          <div className="mt-6">
            <h3 className="font-bold mb-2">생성된 JSON 미리보기:</h3>
            <pre className="bg-gray-100 p-4 rounded border text-sm overflow-x-auto max-h-40">
              {JSON.stringify(generateJSON(), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
