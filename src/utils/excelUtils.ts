import * as XLSX from "xlsx";
import type { Category, Word } from "../types/word";

export interface ExcelRow {
  카테고리: string;
  영어: string;
  한국어: string;
}

// 엑셀 파일에서 데이터 읽기
export const readExcelFile = (file: File): Promise<ExcelRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

        // 데이터 검증
        const validData = jsonData.filter(
          (row) => row.카테고리 && row.영어 && row.한국어
        );

        resolve(validData);
      } catch (error) {
        reject(new Error("엑셀 파일을 읽는 중 오류가 발생했습니다."));
      }
    };

    reader.onerror = () => {
      reject(new Error("파일을 읽을 수 없습니다."));
    };

    reader.readAsBinaryString(file);
  });
};

// 엑셀 데이터를 카테고리 형식으로 변환
export const convertExcelDataToCategories = (
  excelData: ExcelRow[]
): Category[] => {
  const categoriesMap = new Map<string, Word[]>();

  excelData.forEach((row, index) => {
    const word: Word = {
      id: `excel-word-${Date.now()}-${index}`,
      english: row.영어.trim(),
      korean: row.한국어.trim(),
      phonetic: "",
      frequency: 5,
      difficulty: "medium",
      example: "",
    };

    const categoryName = row.카테고리.trim();
    if (!categoriesMap.has(categoryName)) {
      categoriesMap.set(categoryName, []);
    }
    categoriesMap.get(categoryName)!.push(word);
  });

  return Array.from(categoriesMap.entries()).map(([name, words]) => ({
    id: `excel-category-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    name,
    description: `엑셀 파일에서 가져온 카테고리 (${words.length}개 단어)`,
    words,
  }));
};

// 현재 데이터를 엑셀로 다운로드 (편집용)
export const generateDataExcel = (categories: Category[]) => {
  // 현재 데이터를 엑셀 형식으로 변환
  const excelData: ExcelRow[] = [];

  categories.forEach((category) => {
    category.words.forEach((word) => {
      excelData.push({
        카테고리: category.name,
        영어: word.english,
        한국어: word.korean,
      });
    });
  });

  // 데이터가 없으면 샘플 데이터 추가
  if (excelData.length === 0) {
    excelData.push(
      { 카테고리: "일상회화", 영어: "hello", 한국어: "안녕하세요" },
      { 카테고리: "일상회화", 영어: "goodbye", 한국어: "안녕히 가세요" },
      { 카테고리: "일상회화", 영어: "thank you", 한국어: "감사합니다" },
      { 카테고리: "비즈니스", 영어: "meeting", 한국어: "회의" },
      { 카테고리: "비즈니스", 영어: "presentation", 한국어: "발표" }
    );
  }

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // 헤더 스타일링
  const headerRange = XLSX.utils.decode_range(worksheet["!ref"] || "A1:C1");

  // 헤더 행 (첫 번째 행)에 스타일 적용
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;

    // 헤더 셀에 스타일 정보 추가
    worksheet[cellAddress].s = {
      fill: {
        fgColor: { rgb: "4F81BD" }, // 파란색 배경
      },
      font: {
        bold: true,
        color: { rgb: "FFFFFF" }, // 흰색 글자
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };
  }

  // 열 너비 자동 조정
  const colWidths = [
    { wch: 15 }, // 카테고리
    { wch: 20 }, // 영어
    { wch: 20 }, // 한국어
  ];
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "단어목록");

  // 파일 다운로드
  const fileName = `단어_데이터_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// 현재 카테고리를 엑셀로 내보내기
export const exportCategoriesToExcel = (categories: Category[]) => {
  const excelData: ExcelRow[] = [];

  categories.forEach((category) => {
    category.words.forEach((word) => {
      excelData.push({
        카테고리: category.name,
        영어: word.english,
        한국어: word.korean,
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "단어목록");

  const fileName = `단어_데이터_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
