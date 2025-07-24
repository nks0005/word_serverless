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

## 🔄 방법 2: Fork & Pull Request

1. **Fork** 버튼 클릭하여 자신의 저장소로 복사
2. 자신의 저장소에서 파일 편집
3. **Pull Request** 생성하여 변경사항 제출
4. 관리자 승인 후 병합

## 📱 방법 3: GitHub Mobile App

스마트폰에서도 GitHub 앱을 통해 파일을 편집할 수 있습니다!

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
