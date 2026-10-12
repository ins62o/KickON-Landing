# 킥온 KickON

React + TypeScript + Vite 기반의 킥온 제품 소개 랜딩페이지입니다.
Tailwind CSS v4와 Motion을 사용합니다.
글꼴은 Pretendard Variable이며 공식 jsDelivr 동적 서브셋 웹폰트를 사용합니다.

```sh
npm install
npm run dev
```

- `src/App.tsx`: 화면 구현
- `src/HeroSection.tsx`: 파란 영상 오브젝트 위 투명 배경 ON 로고, ‘K리그가 일상이 되는 순간’ 카피, 스토어 버튼
- `src/HeroStats.tsx`, `src/landing-stats.ts`: 실제 사용자 수·GPS 직관 인증 집계와 내림 표시
- `src/MarqueeScroller.tsx`: 팀 엠블럼, 하단 팀 이름, 호버 그라데이션
- `src/teams.ts`: 29개 팀 이름, 자산 경로, 대표 색상
- `src/index.css`: 전역 스타일
- `src/MatchExperience.tsx`: 경기 카드 순차 등장과 실제 경기 상세 화면
- `src/MatchdayMemory.tsx`: 3D 티켓, 인증, 사진, 실제 직관 기록 화면
- `src/FanCommunity.tsx`: 팀 선택, 포인트 색상 변경, 실제 팀 커뮤니티 화면
- `src/DownloadSection.tsx`: 공식 스토어 버튼과 푸터
- `src/SceneMotion.tsx`, `src/useSceneMotion.ts`: 스크롤 모션과 앱 화면 프레임
- `src/product-sections.css`: 새 섹션 스타일과 모바일·동작 줄이기 대응
- `npm run build`: 프로덕션 빌드
- `npm run lint`: 코드 검사
- `npm run test`: 집계 응답·내림 표시·실패·취소 처리 검사
- `npm run preview`: 빌드 결과 미리보기

히어로와 다운로드 섹션에 App Store / Google Play 버튼을 표시합니다.
`src/stores.ts`의 공식 스토어 주소를 함께 사용합니다. 히어로 하단의 떠 있는 메뉴는 제거했습니다.
푸터 서비스 소개는 경기 소개 섹션으로 연결하고, 주소가 없는 개인정보처리방침·이용약관·문의하기는 일반 텍스트로 표시합니다.
브랜드 로고와 팀 엠블럼은 로컬 자산을 사용하고, 영상과 Pretendard 웹폰트는 외부 URL에서 불러옵니다.
ON 로고는 투명 배경의 768px 고해상도 자산 `public/branding/kickon-on-hires.webp`를 사용합니다.

앱 화면, 시연 데이터와 이미지 제작 정보는 [랜딩 확장 기록](docs/landing-expansion.md)을 참고하세요.

서비스 통계는 `.env.local`의 Supabase URL·publishable 키로 공개 `public_landing_stats()` RPC를 조회합니다.
서버 함수의 설치·되돌리기·로컬 SQL 테스트 정보는 [서비스 집계 연결](docs/landing-stats.md)을 참고하세요.

운영 사이트는 `https://kickon.kr`이며 `Prod` 브랜치에 푸시하면 기존 자동 배포가 실행됩니다. `.env.local`은 커밋하지 않습니다. `.env.production`에는 브라우저에서 사용하는 운영 Supabase URL과 publishable 키만 포함하며, 자동 빌드 환경의 동일한 변수로 덮어쓸 수 있습니다. 서버 비밀 키는 포함하지 않습니다.
