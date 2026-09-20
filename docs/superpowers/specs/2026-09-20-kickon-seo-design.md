# KickON 랜딩 페이지 SEO 설계

## 1. 목표

KickON 랜딩 페이지를 `https://kickon.kr`의 대표 검색 문서로 만들고, 검색엔진이 JavaScript를 실행하기 전에도 서비스의 핵심 내용을 이해할 수 있게 한다.

검색 의도 우선순위는 다음과 같다.

1. `K리그 커뮤니티`
2. `K리그 일정`, `K리그 순위`
3. `K리그 직관 기록`, `축구 직관 인증`

기존 화면 디자인과 사용자 문구를 유지하면서 기술 SEO, 소셜 공유 정보, 구조화 데이터, 정적 프리렌더링을 추가한다.

## 2. 현재 상태

- Vite와 React로 구성된 단일 페이지 앱이다.
- `/`, `/terms/`, `/privacy/`, `/account-deletion/` 네 개의 HTML 진입점이 있다.
- 각 문서는 한글 언어와 제목, favicon, viewport, theme color만 제공한다.
- 초기 HTML의 `#root`는 비어 있고 콘텐츠는 클라이언트 JavaScript 실행 후 렌더링된다.
- description, canonical, Open Graph, Twitter Card, JSON-LD, `robots.txt`, `sitemap.xml`이 없다.
- 기존 빌드는 네 HTML 진입점을 정상 생성한다.

## 3. 범위

### 포함

- 경로별 title, description, canonical, robots 설정
- Open Graph와 Twitter Card
- 메인 페이지 JSON-LD
- `robots.txt`와 `sitemap.xml`
- 네 경로의 빌드 타임 프리렌더링
- 프리렌더 HTML hydration
- 실제 KickON 자산을 사용하는 1200×630 공유 이미지
- 정적 테스트, 빌드 결과 검사, 브라우저 hydration 검사

### 제외

- 새로운 FAQ 또는 SEO 전용 가시 콘텐츠 섹션
- 블로그, 뉴스, 팀별 검색 랜딩 페이지
- 검색 순위를 위한 숨김 텍스트나 키워드 반복
- `meta keywords`
- 기존 랜딩 레이아웃과 Supabase 데이터 흐름 변경
- 검색엔진 등록 및 소유권 인증 자동화

## 4. 대표 URL과 인덱싱 정책

| 경로 | canonical | robots | sitemap |
| --- | --- | --- | --- |
| `/` | `https://kickon.kr/` | `index, follow` | 포함 |
| `/terms/` | `https://kickon.kr/terms/` | `index, follow` | 포함 |
| `/privacy/` | `https://kickon.kr/privacy/` | `index, follow` | 포함 |
| `/account-deletion/` | `https://kickon.kr/account-deletion/` | `noindex, follow` | 제외 |

계정 삭제 안내는 앱 심사와 사용자 지원을 위해 공개 접근을 유지하지만 검색 결과에는 노출하지 않는다.

## 5. 메인 페이지 메타데이터

- title: `킥온 | K리그 커뮤니티·일정·순위·직관 기록`
- description: `K리그 경기 일정과 순위, 라인업·득점 알림을 확인하고 직관 인증과 경기 기록, 팀별 커뮤니티를 함께 즐겨보세요.`
- canonical: `https://kickon.kr/`
- `og:type`: `website`
- `og:site_name`: `KickON`
- `og:locale`: `ko_KR`
- `og:title`: `킥온 | 모두를 위한 K리그 커뮤니티`
- `og:description`: 메인 description과 동일
- `og:url`: canonical과 동일
- `og:image`: `https://kickon.kr/branding/kickon-og.png`
- `og:image:width`: `1200`
- `og:image:height`: `630`
- `twitter:card`: `summary_large_image`
- Twitter title, description, image는 Open Graph와 동일

공유 이미지는 실제 KickON 로고와 현재 랜딩에서 사용하는 실제 앱 화면 자산만 사용한다. 가짜 게시물, 가짜 경기 데이터, 가짜 앱 화면을 만들지 않는다.

## 6. 법적 문서 메타데이터

각 법적 문서는 기존 title을 유지하면서 고유 description, canonical, robots를 가진다. Open Graph와 Twitter Card는 브랜드 로고 중심의 공통 정보를 사용한다.

- 이용약관 description: `KickON 서비스 이용에 필요한 회원의 권리와 의무, 이용 조건과 운영 정책을 안내합니다.`
- 개인정보 처리방침 description: `KickON이 처리하는 개인정보의 항목, 이용 목적, 보관 기간과 이용자 권리를 안내합니다.`
- 계정 삭제 요청 description: `KickON 계정과 개인정보 및 활동 데이터를 삭제하는 방법과 처리 범위를 안내합니다.`

## 7. 구조화 데이터

메인 페이지에 하나의 `@graph` JSON-LD를 제공한다.

### WebSite

- `@type`: `WebSite`
- `@id`: `https://kickon.kr/#website`
- `url`: `https://kickon.kr/`
- `name`: `KickON`
- `alternateName`: `킥온`
- `inLanguage`: `ko-KR`

### Organization

- `@type`: `Organization`
- `@id`: `https://kickon.kr/#organization`
- `name`: `KickON`
- `url`: `https://kickon.kr/`
- `logo`: `https://kickon.kr/branding/kickon-app-icon.png`

### MobileApplication

- `@type`: `MobileApplication`
- `@id`: `https://kickon.kr/#app`
- `name`: `KickON`
- `alternateName`: `킥온`
- `applicationCategory`: `SportsApplication`
- `operatingSystem`: `iOS, Android`
- `description`: 메인 description과 동일
- `url`: `https://kickon.kr/`
- `downloadUrl`: App Store와 Google Play의 기존 실제 URL

평점, 리뷰 수, 가격처럼 현재 랜딩이 검증할 수 없는 필드는 추가하지 않는다.

## 8. 크롤링 파일

### robots.txt

- 모든 일반 크롤러가 공개 경로를 읽을 수 있게 한다.
- `Sitemap: https://kickon.kr/sitemap.xml`을 선언한다.
- 계정 삭제 경로의 검색 제외는 `robots.txt` 차단이 아니라 HTML의 `noindex, follow`로 처리한다. 크롤러가 noindex를 읽을 수 있어야 하기 때문이다.

### sitemap.xml

- `/`, `/terms/`, `/privacy/`만 포함한다.
- 절대 URL은 모두 `https://kickon.kr`을 사용한다.
- 배포 시점과 무관한 임의의 `lastmod`, `changefreq`, `priority` 값은 넣지 않는다.

## 9. 프리렌더링 구조

경로별 페이지 선택을 공용 모듈로 분리해 클라이언트 진입점과 프리렌더 스크립트가 같은 컴포넌트를 사용한다.

빌드 흐름은 다음과 같다.

1. TypeScript 검사와 Vite 클라이언트 빌드를 실행한다.
2. 프리렌더 스크립트가 각 경로 컴포넌트를 서버 렌더링한다.
3. 생성된 `dist` HTML의 `#root`에 해당 경로의 React 마크업을 삽입한다.
4. 경로별 메타데이터와 JSON-LD가 최종 HTML에 존재하는지 검사한다.
5. 누락이나 렌더 오류가 있으면 빌드를 실패시킨다.

클라이언트는 `#root`에 서버 마크업이 있으면 `hydrateRoot`를 사용하고, 개발 환경처럼 비어 있으면 `createRoot`를 사용한다. 이 방식은 초기 HTML 콘텐츠를 유지하면서 기존 효과와 상호작용을 연결한다.

프리렌더 과정은 네트워크 요청을 하지 않는다. 팬 데이터처럼 런타임에 필요한 정보는 기존 로딩 상태로 렌더링하고, 브라우저에서 현재 흐름대로 갱신한다.

## 10. 공유 이미지

- 파일: `public/branding/kickon-og.png`
- 크기: 정확히 1200×630
- 배경: 현재 랜딩의 딥 네이비
- 콘텐츠: 실제 KickON 로고, 대표 문구, 현재 사용 중인 실제 앱 화면 자산
- 안전 영역: 주요 로고와 문구를 중앙 1080×550 안에 배치
- 작은 공유 카드에서도 브랜드명과 `K리그 커뮤니티`가 식별되어야 한다.
- 이미지 자체에 검색 키워드를 과도하게 반복하지 않는다.

## 11. 오류 처리

- 알 수 없는 프리렌더 경로는 조용히 메인 페이지로 대체하지 않고 오류로 처리한다.
- 경로별 title, description, canonical, robots 중 하나라도 없으면 테스트와 빌드를 실패시킨다.
- JSON-LD가 유효한 JSON이 아니거나 절대 URL 정책을 어기면 빌드를 실패시킨다.
- `kickon.kr` 외의 canonical 또는 sitemap URL이 발견되면 실패시킨다.
- hydration 오류가 발생하면 프리렌더 출력을 배포하지 않는다.

## 12. 테스트와 검증

### 정적 테스트

- 네 HTML 진입점의 경로별 메타데이터 검사
- 메인 Open Graph와 Twitter Card 검사
- JSON-LD 파싱과 필수 타입 및 URL 검사
- `robots.txt`의 sitemap 선언 검사
- `sitemap.xml`의 포함 및 제외 경로 검사
- `meta keywords` 부재 검사
- 계정 삭제 페이지의 `noindex, follow` 검사

### 빌드 테스트

- `npm run build`가 성공해야 한다.
- `dist/index.html`에 메인 H1과 핵심 한국어 문구가 포함되어야 한다.
- 법적 문서 빌드 HTML에 해당 H1과 본문이 포함되어야 한다.
- 모든 최종 HTML의 `#root`가 비어 있지 않아야 한다.

### 브라우저 검증

- 프리렌더 콘텐츠가 로드 직후 보이고 hydration 후 동일하게 유지되는지 확인한다.
- React hydration warning과 애플리케이션 오류가 없어야 한다.
- App Store와 Google Play 링크, 애니메이션, 기존 반응형 레이아웃이 유지되어야 한다.
- 320, 375, 430, 768, 1024, 1280, 1440px에서 가로 overflow가 없어야 한다.
- Lighthouse SEO 검사를 실행하고 실패 항목을 기록한다.

### 최종 명령

- `npm run lint`
- `npm test`
- `npm run test:integration` with the existing local Supabase environment
- `npm run build`
- `git diff --check`

## 13. 성공 기준

- 검색엔진이 JavaScript 없이 메인 H1과 핵심 서비스 설명을 읽을 수 있다.
- 모든 공개 문서가 정확한 `kickon.kr` canonical을 가진다.
- 공유 미리보기에 전용 1200×630 이미지와 승인된 문구가 표시된다.
- 메인 페이지가 유효한 WebSite, Organization, MobileApplication 구조화 데이터를 제공한다.
- 계정 삭제 안내는 접근 가능하지만 검색 결과에서는 제외된다.
- 기존 랜딩 디자인, 앱 링크, Supabase 흐름, 반응형 동작에 회귀가 없다.

## 14. 변경 예상 파일

- Modify: `index.html`
- Modify: `terms/index.html`
- Modify: `privacy/index.html`
- Modify: `account-deletion/index.html`
- Modify: `package.json`
- Modify: `src/main.tsx`
- Modify: `vite.config.ts`
- Modify: 기존 테스트 파일 또는 SEO 전용 테스트 파일
- Create: 경로 및 SEO 설정 공용 모듈
- Create: 프리렌더 스크립트
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Create: `public/branding/kickon-og.png`

새 런타임 의존성은 추가하지 않는다.
