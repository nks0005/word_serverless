import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 개발 모드에서만 파일 업데이트 API 활성화
    {
      name: "word-data-api",
      configureServer(server) {
        server.middlewares.use("/api/save-words", (req, res) => {
          if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                const categories = JSON.parse(body);

                // TypeScript 파일 내용 생성
                const fileContent = `import type { Category } from '../types/word';

export const sampleCategories: Category[] = ${JSON.stringify(
                  categories,
                  null,
                  2
                )};

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

                // 파일 저장
                const filePath = path.resolve(
                  __dirname,
                  "src/data/sampleWords.ts"
                );
                fs.writeFileSync(filePath, fileContent, "utf-8");

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: true,
                    message: "단어 데이터가 저장되었습니다!",
                  })
                );
              } catch (error) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: false,
                    error: (error as Error).message,
                  })
                );
              }
            });
          } else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method not allowed" }));
          }
        });
      },
    },
  ],
  base: "/word_serverless/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
