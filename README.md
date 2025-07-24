# 🎯 영어 단어 퀴즈 애플리케이션

React + TypeScript로 만든 인터랙티브 영어 단어 학습 퀴즈 애플리케이션입니다.

## ✨ 주요 기능

### 📚 퀴즈 기능

- **다양한 퀴즈 모드**: 영어→한국어, 한국어→영어
- **카테고리별 학습**: 기초 어휘, 학교 생활, 비즈니스 영어 등
- **실시간 타이머**: 30초 제한시간으로 집중력 향상
- **즉시 피드백**: 정답/오답 즉시 확인
- **점수 및 통계**: 정답률, 소요시간 등 상세 통계

### 🔊 음성 기능

- **Web Speech API**: 영어 단어 음성 발음
- **발음 기호 표시**: 정확한 발음 학습 지원

### 📝 오답노트

- **자동 저장**: 틀린 문제 자동으로 오답노트에 추가
- **복습 모드**: 틀린 문제만 다시 풀어보기
- **로컬 스토리지**: 브라우저에 데이터 저장

### ⚙️ 관리자 기능

- **단어 데이터 편집**: 새로운 단어 추가/수정/삭제
- **카테고리 관리**: 새로운 카테고리 생성 및 관리
- **데이터 내보내기/가져오기**: JSON 형태로 백업 및 복원

### 📱 PWA 지원

- **오프라인 사용**: 인터넷 없이도 학습 가능
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화

## 🚀 시작하기

### 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/your-username/word_serverless.git
cd word_serverless

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── CategorySelector.tsx
│   ├── QuizCard.tsx
│   ├── QuizResult.tsx
│   └── WordEditor.tsx
├── data/               # 단어 데이터
│   └── sampleWords.ts
├── hooks/              # 커스텀 훅
│   ├── useLocalStorage.ts
│   └── useSpeech.ts
├── types/              # TypeScript 타입 정의
│   └── word.ts
├── utils/              # 유틸리티 함수
│   └── quizGenerator.ts
├── App.tsx             # 메인 앱 컴포넌트
└── main.tsx           # 앱 진입점
```

## 🎮 사용법

### 1. 카테고리 선택

- 메인 화면에서 학습하고 싶은 카테고리를 선택
- "전체 단어"를 선택하면 모든 카테고리의 단어로 퀴즈

### 2. 퀴즈 진행

- 30초 제한시간 내에 정답 선택
- 발음 버튼(🔊)을 클릭해서 영어 단어 듣기
- 선택 후 3초간 정답/오답 확인

### 3. 결과 확인

- 총점, 정답률, 소요시간 확인
- 틀린 문제 목록 확인
- "다시 풀기" 또는 "오답노트 복습하기" 선택

### 4. 단어 데이터 편집 (관리자)

- 메인 화면에서 "단어 데이터 편집하기" 클릭
- 새로운 단어/카테고리 추가
- 기존 단어 수정/삭제
- JSON 파일로 데이터 백업/복원

## 📊 데이터 구조

### 단어 (Word)

```typescript
interface Word {
  id: string;
  english: string; // 영어 단어
  korean: string; // 한국어 뜻
  phonetic?: string; // 발음 기호
  frequency: number; // 사용 빈도 (1-10)
  difficulty: "easy" | "medium" | "hard";
  example?: string; // 예문
}
```

### 카테고리 (Category)

```typescript
interface Category {
  id: string;
  name: string; // 카테고리 이름
  description?: string; // 카테고리 설명
  words: Word[]; // 포함된 단어들
}
```

## 🌐 배포

이 애플리케이션은 GitHub Pages에 자동 배포됩니다:

1. `main` 브랜치에 푸시
2. GitHub Actions가 자동으로 빌드 및 배포
3. `https://your-username.github.io/word_serverless/`에서 접속 가능

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🎯 향후 계획

- [ ] 더 많은 단어 데이터 추가
- [ ] 단어 학습 진도 추적
- [ ] 소셜 공유 기능
- [ ] 다크 모드 지원
- [ ] 음성 인식을 통한 발음 연습
- [ ] 게임화 요소 (레벨, 뱃지 시스템)

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 언제든 이슈를 생성해 주세요!
