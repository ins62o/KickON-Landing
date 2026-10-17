# KICKON Landing

React 19, TypeScript, Vite 기반 킥온 랜딩 페이지입니다. 야간 경기장 배경을 공유하며 홈·주요 기능·직관 기록·이용 안내를 페이지 새로고침 없이 전환합니다.

```sh
npm install
npm run dev
npm test
npm run lint
npm run build
npm run preview
```

- `src/landing/LandingApp.tsx`: 공통 배경·헤더·모바일 메뉴와 React 화면 전환
- `src/landing/Views.tsx`: 홈, 경기 일정·실시간 경기·팬 커뮤니티 모션, 사진을 걸어둔 직관 기록
- `src/landing/PolicyViews.tsx`: 세 이용 문서 선택 카드와 기존 문서 읽기 화면
- `src/landing/ContactModal.tsx`, `src/contact.ts`: 문의 입력·검증·서버 전송
- `main.js`, `navigation.js`, `product.js`: 공개 집계·한국 시간 D+·내비게이션·모션의 초기화와 정리
- `styles.css`, `product.css`: 반응형 화면·도트 글꼴·호버 및 동작 줄이기 지원
- `supabase/functions/landing-contact`: Resend 문의 발송 서버

홈의 가입자·직관 기록은 기존 Supabase 공개 집계 API를 조회합니다. 가입자는 100명, GPS 직관 인증은 10건 단위로 내림하며 조회할 수 없으면 `—`를 표시합니다. D+는 한국 시간의 2026-09-10을 기준으로 계산합니다.

로컬 설정은 `.env.example`을 참고해 `.env.local`에 작성합니다. 기존에 추적된 `.env.production`에는 브라우저용 Supabase URL과 publishable 키만 포함되어 있습니다. Resend 키와 서버 비밀 키는 Supabase 서버 Secrets에만 저장합니다.

운영 사이트는 `https://kickon.kr`이며 `Prod` 브랜치 푸시는 기존 자동 배포와 연결되어 있습니다. 빌드 결과는 `dist/`입니다. 슬래시 없는 주소의 직접 접속·새로고침에는 CloudFront 요청 변환도 필요하므로 [운영 라우팅 안내](docs/clean-routes.md)를 확인합니다.

글꼴·이미지는 프로젝트 자산을 사용하며 일부 외부 글꼴과 Font Awesome은 인터넷 연결이 필요합니다. 로컬 글꼴 라이선스는 `fonts/`, `public/fonts/`, `public/licenses/`에 포함되어 있습니다.

- [화면 및 모션 안내](docs/product-pages.md)
- [문의 메일 연결 및 실제 전송 확인](docs/contact-email.md)
- [공개 서비스 집계](docs/landing-stats.md)
- [기존 운영 배포 기록](docs/production-deployment-20261012.md)
