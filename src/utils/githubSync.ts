import type { Category } from "../types/word";

const GITHUB_API_BASE = "https://api.github.com";
const REPO_OWNER = "anhyoungbin"; // 사용자명으로 변경
const REPO_NAME = "word_serverless";
const FILE_PATH = "src/data/sampleWords.ts";

export interface GitHubConfig {
  token: string;
  commitMessage?: string;
}

export const syncToGitHub = async (
  categories: Category[],
  config: GitHubConfig
): Promise<boolean> => {
  try {
    // 1. 현재 파일 정보 가져오기
    const getCurrentFile = async () => {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        {
          headers: {
            Authorization: `Bearer ${config.token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API 오류: ${response.status}`);
      }

      return response.json();
    };

    // 2. 새로운 파일 내용 생성
    const generateFileContent = (data: Category[]) => {
      return `import type { Category } from '../types/word';

export const sampleCategories: Category[] = ${JSON.stringify(data, null, 2)};

export const getAllWords = () => {
  return sampleCategories.flatMap(category => category.words);
};

export const getWordsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
  return getAllWords().filter(word => word.difficulty === difficulty);
};

export const getWordsByCategory = (categoryId: string) => {
  const category = sampleCategories.find(cat => cat.id === categoryId);
  return category ? category.words : [];
};`;
    };

    // 3. 파일 정보 가져오기
    const fileInfo = await getCurrentFile();

    // 4. 새 내용으로 파일 업데이트
    const newContent = generateFileContent(categories);
    const encodedContent = btoa(unescape(encodeURIComponent(newContent)));

    const updateResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message:
            config.commitMessage ||
            `Update vocabulary data - ${new Date().toISOString()}`,
          content: encodedContent,
          sha: fileInfo.sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`파일 업데이트 실패: ${updateResponse.status}`);
    }

    return true;
  } catch (error) {
    console.error("GitHub 동기화 오류:", error);
    return false;
  }
};

export const validateGitHubToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    return response.ok;
  } catch {
    return false;
  }
};
