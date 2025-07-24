import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Download,
  Upload,
  Zap,
  FileSpreadsheet,
} from "lucide-react";
import type { Category, Word } from "../types/word";
import {
  saveWordsToLocalFile,
  isLocalFileSyncAvailable,
} from "../utils/localFileSync";
import {
  readExcelFile,
  convertExcelDataToCategories,
  generateDataExcel,
  type ExcelRow,
} from "../utils/excelUtils";
import { NotificationModal } from "./NotificationModal";

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

  // 엑셀 미리보기 상태
  const [excelPreview, setExcelPreview] = useState<{
    isOpen: boolean;
    data: ExcelRow[];
    originalFileName: string;
  }>({
    isOpen: false,
    data: [],
    originalFileName: "",
  });

  // 새 행 추가 모달 상태
  const [addRowModal, setAddRowModal] = useState<{
    isOpen: boolean;
    selectedCategory: string;
    english: string;
    korean: string;
  }>({
    isOpen: false,
    selectedCategory: "",
    english: "",
    korean: "",
  });

  // 알림 모달 상태
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

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

  const handleAddWord = async () => {
    if (!newWord.english || !newWord.korean || !selectedCategoryId) return;

    const word: Word = {
      id: generateId(),
      english: newWord.english,
      korean: newWord.korean,
      phonetic: "",
      frequency: 5,
      difficulty: "medium",
      example: "",
    };

    const updatedCategories = categories.map((cat) =>
      cat.id === selectedCategoryId
        ? { ...cat, words: [...cat.words, word] }
        : cat
    );

    onUpdateCategories(updatedCategories);

    // 개발 환경에서 로컬 파일에 자동 저장
    if (isLocalFileSyncAvailable()) {
      await saveWordsToLocalFile(updatedCategories);
      showNotification(
        "성공",
        "단어가 추가되고 로컬 파일에 저장되었습니다.",
        "success"
      );
    } else {
      showNotification("성공", "단어가 추가되었습니다.", "success");
    }

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

  // 알림 표시 함수
  const showNotification = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" = "success"
  ) => {
    setNotification({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  // 엑셀 파일 업로드 처리
  const handleExcelImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 확장자 체크
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls"].includes(fileExtension || "")) {
      showNotification(
        "오류",
        "엑셀 파일(.xlsx, .xls)만 업로드할 수 있습니다.",
        "error"
      );
      return;
    }

    try {
      const excelData = await readExcelFile(file);

      if (excelData.length === 0) {
        showNotification(
          "경고",
          "유효한 데이터가 없습니다. 카테고리, 영어, 한국어 열이 모두 필요합니다.",
          "warning"
        );
        return;
      }

      // 미리보기 모달 열기
      setExcelPreview({
        isOpen: true,
        data: excelData,
        originalFileName: file.name,
      });
    } catch (error) {
      showNotification(
        "오류",
        error instanceof Error
          ? error.message
          : "파일을 읽는 중 오류가 발생했습니다.",
        "error"
      );
    }

    // 파일 입력 초기화
    event.target.value = "";
  };

  // 엑셀 미리보기에서 확인 버튼 클릭
  const handleConfirmExcelImport = async () => {
    try {
      const newCategories = convertExcelDataToCategories(excelPreview.data);

      // 기존 데이터를 모두 삭제하고 새로운 데이터로 교체
      onUpdateCategories(newCategories);

      // 개발 환경에서 자동 저장
      if (isLocalFileSyncAvailable()) {
        await saveWordsToLocalFile(newCategories);
      }

      setExcelPreview({ isOpen: false, data: [], originalFileName: "" });

      showNotification(
        "성공",
        `기존 데이터를 삭제하고 엑셀 파일에서 ${excelPreview.data.length}개의 단어를 새로 등록했습니다.`,
        "success"
      );
    } catch (error) {
      showNotification("오류", "데이터 적용 중 오류가 발생했습니다.", "error");
    }
  };

  // 엑셀 미리보기 데이터 수정
  const handleUpdateExcelPreview = (
    index: number,
    field: keyof ExcelRow,
    value: string
  ) => {
    setExcelPreview((prev) => ({
      ...prev,
      data: prev.data.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      ),
    }));
  };

  // 엑셀 미리보기에서 행 삭제
  const handleDeleteExcelRow = (index: number) => {
    setExcelPreview((prev) => ({
      ...prev,
      data: prev.data.filter((_, i) => i !== index),
    }));
  };

  // 엑셀 미리보기에서 행 추가 모달 열기
  const handleAddExcelRow = () => {
    // 기존 카테고리들 추출
    const existingCategories = [
      ...new Set(excelPreview.data.map((row) => row.카테고리).filter(Boolean)),
    ];

    setAddRowModal({
      isOpen: true,
      selectedCategory:
        existingCategories.length > 0 ? existingCategories[0] : "",
      english: "",
      korean: "",
    });
  };

  // 새 행 추가 확인
  const handleConfirmAddRow = () => {
    if (!addRowModal.english || !addRowModal.korean) {
      showNotification(
        "경고",
        "영어 단어와 한국어 뜻을 모두 입력해주세요.",
        "warning"
      );
      return;
    }

    setExcelPreview((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          카테고리: addRowModal.selectedCategory || "미분류",
          영어: addRowModal.english,
          한국어: addRowModal.korean,
        },
      ],
    }));

    // 모달 초기화
    setAddRowModal({
      isOpen: false,
      selectedCategory: "",
      english: "",
      korean: "",
    });
  };

  // 로컬 저장 함수 (알림 포함)
  const handleLocalSave = async () => {
    if (!isLocalFileSyncAvailable()) {
      showNotification("오류", "로컬 저장 기능을 사용할 수 없습니다.", "error");
      return;
    }

    try {
      await saveWordsToLocalFile(categories);
      showNotification(
        "성공",
        "데이터가 로컬 파일에 저장되었습니다.",
        "success"
      );
    } catch (error) {
      showNotification("오류", "저장 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">단어 데이터 편집기</h2>
          <div className="flex gap-2">
            <label className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              엑셀 업로드
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelImport}
                className="hidden"
              />
            </label>

            <button
              onClick={() => generateDataExcel(categories)}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              데이터 다운로드
            </button>

            {/* 개발 모드에서만 표시 */}
            {isLocalFileSyncAvailable() && (
              <button
                onClick={handleLocalSave}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                로컬 저장
              </button>
            )}
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
                          </div>
                          <p className="text-gray-800 mb-1">{word.korean}</p>
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

        {/* 엑셀 미리보기 모달 */}
        {excelPreview.isOpen && (
          <ExcelPreviewModal
            data={excelPreview.data}
            fileName={excelPreview.originalFileName}
            onConfirm={handleConfirmExcelImport}
            onCancel={() =>
              setExcelPreview({ isOpen: false, data: [], originalFileName: "" })
            }
            onUpdateRow={handleUpdateExcelPreview}
            onDeleteRow={handleDeleteExcelRow}
            onAddRow={handleAddExcelRow}
          />
        )}

        {/* 새 행 추가 모달 */}
        {addRowModal.isOpen && (
          <AddRowModal
            data={excelPreview.data}
            selectedCategory={addRowModal.selectedCategory}
            english={addRowModal.english}
            korean={addRowModal.korean}
            onCategoryChange={(category) =>
              setAddRowModal((prev) => ({
                ...prev,
                selectedCategory: category,
              }))
            }
            onEnglishChange={(english) =>
              setAddRowModal((prev) => ({ ...prev, english }))
            }
            onKoreanChange={(korean) =>
              setAddRowModal((prev) => ({ ...prev, korean }))
            }
            onConfirm={handleConfirmAddRow}
            onCancel={() =>
              setAddRowModal({
                isOpen: false,
                selectedCategory: "",
                english: "",
                korean: "",
              })
            }
          />
        )}

        {/* 알림 모달 */}
        <NotificationModal
          isOpen={notification.isOpen}
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotification((prev) => ({ ...prev, isOpen: false }))
          }
        />
      </div>
    </div>
  );
};

// 새 행 추가 모달 컴포넌트
const AddRowModal: React.FC<{
  data: ExcelRow[];
  selectedCategory: string;
  english: string;
  korean: string;
  onCategoryChange: (category: string) => void;
  onEnglishChange: (english: string) => void;
  onKoreanChange: (korean: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({
  data,
  selectedCategory,
  english,
  korean,
  onCategoryChange,
  onEnglishChange,
  onKoreanChange,
  onConfirm,
  onCancel,
}) => {
  // 기존 카테고리들 추출
  const existingCategories = [
    ...new Set(data.map((row) => row.카테고리).filter(Boolean)),
  ];
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[90]">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-4">새 단어 추가</h3>

        <div className="space-y-4">
          {/* 카테고리 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <div className="space-y-2">
              {existingCategories.length > 0 && (
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!isNewCategory}
                      onChange={() => setIsNewCategory(false)}
                      className="mr-2"
                    />
                    <span className="text-sm">기존 카테고리 선택</span>
                  </label>
                  {!isNewCategory && (
                    <select
                      value={selectedCategory}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {existingCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={isNewCategory}
                    onChange={() => setIsNewCategory(true)}
                    className="mr-2"
                  />
                  <span className="text-sm">새 카테고리 만들기</span>
                </label>
                {isNewCategory && (
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                      onCategoryChange(e.target.value);
                    }}
                    placeholder="새 카테고리명 입력"
                    className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 영어 단어 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              영어 단어
            </label>
            <input
              type="text"
              value={english}
              onChange={(e) => onEnglishChange(e.target.value)}
              placeholder="영어 단어를 입력하세요"
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 한국어 뜻 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              한국어 뜻
            </label>
            <input
              type="text"
              value={korean}
              onChange={(e) => onKoreanChange(e.target.value)}
              placeholder="한국어 뜻을 입력하세요"
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

// 엑셀 미리보기 모달 컴포넌트
const ExcelPreviewModal: React.FC<{
  data: ExcelRow[];
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
  onUpdateRow: (index: number, field: keyof ExcelRow, value: string) => void;
  onDeleteRow: (index: number) => void;
  onAddRow: () => void;
}> = ({
  data,
  fileName,
  onConfirm,
  onCancel,
  onUpdateRow,
  onDeleteRow,
  onAddRow,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[80]">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b bg-blue-50">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            엑셀 파일 미리보기
          </h3>
          <p className="text-gray-600">파일명: {fileName}</p>
          <p className="text-sm text-gray-500 mt-1">
            {data.length}개의 단어가 감지되었습니다. 데이터를 확인하고 편집한 후
            "적용"을 클릭하세요.
          </p>
        </div>

        {/* 데이터 테이블 */}
        <div className="flex-1 overflow-auto p-6">
          <div className="min-w-full">
            {/* 카테고리별 그룹화된 데이터 */}
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {(() => {
                // 카테고리별로 데이터 그룹화
                const groupedData = data.reduce((groups, row, index) => {
                  const category = row.카테고리 || "미분류";
                  if (!groups[category]) {
                    groups[category] = [];
                  }
                  groups[category].push({ ...row, originalIndex: index });
                  return groups;
                }, {} as Record<string, Array<ExcelRow & { originalIndex: number }>>);

                return Object.entries(groupedData).map(([category, rows]) => (
                  <div
                    key={category}
                    className="border rounded-lg overflow-hidden"
                  >
                    {/* 카테고리 헤더 */}
                    <div className="bg-blue-500 text-white p-3 font-semibold flex items-center justify-between">
                      <span>📁 {category}</span>
                      <span className="text-blue-100 text-sm">
                        {rows.length}개 단어
                      </span>
                    </div>

                    {/* 카테고리 내 단어들 */}
                    <div className="bg-gray-50">
                      {/* 테이블 헤더 */}
                      <div className="grid grid-cols-4 gap-3 p-3 bg-gray-200 font-medium text-gray-700">
                        <div>카테고리</div>
                        <div>영어</div>
                        <div>한국어</div>
                        <div className="text-center">작업</div>
                      </div>

                      {/* 단어 행들 */}
                      <div className="space-y-1 p-2">
                        {rows.map((row) => (
                          <div
                            key={row.originalIndex}
                            className="grid grid-cols-4 gap-3 p-2 bg-white border rounded hover:bg-blue-50 transition-colors"
                          >
                            <input
                              type="text"
                              value={row.카테고리}
                              onChange={(e) =>
                                onUpdateRow(
                                  row.originalIndex,
                                  "카테고리",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="카테고리"
                            />
                            <input
                              type="text"
                              value={row.영어}
                              onChange={(e) =>
                                onUpdateRow(
                                  row.originalIndex,
                                  "영어",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="영어 단어"
                            />
                            <input
                              type="text"
                              value={row.한국어}
                              onChange={(e) =>
                                onUpdateRow(
                                  row.originalIndex,
                                  "한국어",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="한국어 뜻"
                            />
                            <div className="flex justify-center">
                              <button
                                onClick={() => onDeleteRow(row.originalIndex)}
                                className="px-2 py-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                                title="행 삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* 행 추가 버튼 */}
            <div className="mt-6 pt-4 border-t">
              <button
                onClick={onAddRow}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />새 행 추가
              </button>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <strong>주의:</strong> "적용"을 클릭하면 기존 데이터가 모두 삭제되고
            새로운 데이터로 교체됩니다.
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              적용
            </button>
          </div>
        </div>
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
