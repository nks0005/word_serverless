# 📝 단어 추가하기 가이드

영어 단어 퀴즈에 새로운 단어를 추가하는 방법을 안내합니다.

## 🌐 방법 1: GitHub에서 직접 편집 (추천)

### 1단계: 파일 열기

1. [src/data/sampleWords.ts](https://github.com/anhyoungbin/word_serverless/blob/main/src/data/sampleWords.ts) 클릭
2. 우측 상단의 **✏️ 연필 아이콘** 클릭

### 2단계: 단어 추가

기존 패턴을 따라 새로운 단어를 추가하세요:

```typescript
{
  id: 'unique-word-id',           // 고유한 ID (영문 소문자, 하이픈 사용)
  english: 'example',             // 영어 단어
  korean: '예시',                  // 한국어 뜻
  phonetic: '/ɪɡˈzæmpl/',         // 발음 기호 (선택사항)
  frequency: 7,                   // 사용 빈도 (1-10)
  difficulty: 'medium',           // 난이도: 'easy', 'medium', 'hard'
  example: 'This is an example.' // 예문 (선택사항)
}
```

### 3단계: 커밋하기

1. 페이지 하단 **"Commit changes"** 클릭
2. 제목: `Add new word: [단어명]` 입력
3. **"Commit directly to main branch"** 선택
4. **"Commit changes"** 클릭

### 4단계: 자동 배포 확인

- [Actions 탭](https://github.com/anhyoungbin/word_serverless/actions)에서 배포 진행 상황 확인
- 완료 후 [웹사이트](https://anhyoungbin.github.io/word_serverless/)에서 새 단어 확인

## 🛠️ 방법 2: 로컬 개발 환경 (관리자용)

```bash
# 저장소 클론
git clone https://github.com/anhyoungbin/word_serverless.git
cd word_serverless

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

1. 브라우저에서 관리 페이지 접속
2. 단어 추가/편집 (자동으로 파일 저장됨)
3. Git 커밋 및 푸시

```bash
git add .
git commit -m "Add new words"
git push origin main
```

## 🔄 방법 3: Fork & Pull Request

1. **Fork** 버튼 클릭하여 자신의 저장소로 복사
2. 자신의 저장소에서 파일 편집
3. **Pull Request** 생성하여 변경사항 제출
4. 관리자 승인 후 병합

## ❓ 도움이 필요하면

이슈를 생성하거나 관리자에게 연락해주세요.

---

## 📋 단어 추가 템플릿

```typescript
{
  id: '',
  english: '',
  korean: '',
  phonetic: '',
  frequency: 5,
  difficulty: 'medium',
  example: ''
}
```
