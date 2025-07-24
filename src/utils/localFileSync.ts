import type { Category } from "../types/word";

export const saveWordsToLocalFile = async (
  categories: Category[]
): Promise<boolean> => {
  try {
    const response = await fetch("/api/save-words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categories),
    });

    const result = await response.json();

    if (result.success) {
      console.log("✅ 단어 데이터가 로컬 파일에 저장되었습니다!");
      return true;
    } else {
      console.error("❌ 파일 저장 실패:", result.error);
      return false;
    }
  } catch (error) {
    console.error("❌ 파일 저장 중 오류:", error);
    return false;
  }
};

// 개발 환경에서만 사용 가능한지 확인
export const isLocalFileSyncAvailable = (): boolean => {
  return import.meta.env.DEV;
};
