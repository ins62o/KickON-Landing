# 킥온 제품 소개 섹션

기존 히어로의 크기, 영상과 ON 로고를 보존했습니다. 이후 요청에 따라 전체 글꼴은 Pretendard로 변경하고 히어로의 시작 버튼은 두 스토어 다운로드 버튼으로 교체했습니다. 메인 카피는 ‘K리그가 일상이 되는 순간’이며 하단의 떠 있는 메뉴는 제거했습니다.
기존 팀 마키 컴포넌트, 팀 데이터, 전역 CSS도 수정하지 않았습니다.
삭제된 이전 홈페이지 섹션이나 법적 페이지는 복원하지 않았습니다.
새 패키지를 설치하지 않았습니다.

## 모션

- 경기 정보: Motion `useScroll`로 일정, 스코어, 라인업, 실제 앱 화면을 서로 다른 진행률에서 표시합니다. 카드의 opacity, translateY, scale을 변경합니다. 왼쪽 카드 세 개는 실제 앱 캡처 일부를 표시하고, 오른쪽은 경기 상세 화면입니다. 축구공 장식은 제거했습니다. 카드와 폰은 CSS Grid로 배치하며 라인업 이미지 높이에 맞춰 영역이 자동으로 늘어납니다.
- 직관 기록: 티켓에 CSS perspective와 스크롤 기반 rotateX/rotateY/scale을 적용합니다. 인증 표시와 사진 두 장이 순서대로 나타나고 다음 영역에 실제 직관 기록 화면이 등장합니다. 티켓의 작은 부유 움직임과 그림자 변화는 화면 안에서만 반복됩니다.
- 커뮤니티: 예시 메시지가 순서대로 중앙으로 이동하고 실제 앱 화면이 나타납니다. 인천·울산·부산 선택 시 화면과 색상이 바뀝니다. 색상은 `src/teams.ts`만 사용합니다.
- 다운로드: 기존 ON 앱 아이콘에 블루 글로우와 작은 부유 움직임을 적용했습니다.
- 과도한 스크롤 고정이나 가로 스크롤 연출은 사용하지 않습니다.

## 접근성과 성능

모바일에서는 스크롤 카드와 티켓 3D 변환을 제거하고 세로 순서로 즉시 읽을 수 있게 표시합니다. 반복 움직임도 정지합니다.
`prefers-reduced-motion`에서는 스크롤 변환과 반복 움직임 없이 내용을 보여줍니다.
CSS 반복 모션은 Motion의 `useInView`로 화면 밖에서 정지하고, 히어로 영상은 IntersectionObserver와 문서 visibilitychange로 재생을 제어합니다. Observer와 이벤트 리스너는 정리합니다.
팀 버튼은 네이티브 button, `aria-pressed`, 그룹 이름과 포커스 표시를 사용합니다.
이미지에는 크기를 예약했고, 새 섹션 이미지에는 lazy loading을 적용했습니다.
실제 앱 캡처와 사진 10개를 WebP로 압축했습니다. 합계 약 473KB입니다. O 축구공 이미지는 현재 페이지에서 사용하지 않습니다.

## 앱 화면과 시연 데이터

`public/product/`의 match-detail, attendance-history, community-incheon, community-ulsan, community-busan-ipark는 기존 프로젝트 백업의 실제 앱 화면을 크기 조절하고 WebP로 압축한 것입니다. 새로운 가짜 앱 스크린샷을 만들지 않았습니다.
앱 화면 속 경기와 게시물은 촬영용 예시 데이터입니다. 현재 실시간 경기 데이터가 아닙니다. 경기 소개 영역 아래에 이를 표시합니다.
`public/product/match-fixtures.webp`, `public/product/match-preview-detail.webp`는 앱 프로젝트의 `marketing/jeonmoal/2026-10-09/sources/fixtures.png`, `match-detail.png` 실제 캡처를 압축한 이미지입니다. 현재 일정·스코어 카드는 원본 PNG에서 카드 영역만 픽셀 단위로 잘라낸 `match-schedule-card.webp`(724×378), `match-score-card.webp`(724×474)를 사용합니다. 화면 내용을 재생성하지 않습니다.
직관 티켓과 주변 응원 메시지는 기능 시연입니다. 실제 발급 티켓이나 실제 이용자 게시물로 표시하지 않습니다.
`public/product/match-lineup.webp`는 2026-10-12에 `KICKON Jeonmoal Capture 20261009` iOS 27 시뮬레이터에서 실제 앱을 열고 라인업까지 스크롤해 새로 촬영한 이미지입니다. 기존 `kickon-dev://qa/store?team=jeonbuk` 메모리 기반 QA 시나리오를 사용했습니다. 현재 표시는 이 원본에서 카드만 잘라낸 `match-lineup-card.webp`(724×936)를 사용하며 포메이션과 양 팀 선발 선수 22명 전체를 포함합니다. 원본 1206×2622 PNG는 `docs/captures/2026-10-12/match-lineup.png`에 보존했습니다. 앱 코드나 운영 데이터는 변경하지 않았으며 화면을 재생성하거나 선수 이름을 덧그리지 않았습니다.

세 이미지 모두 절대 위치와 비율 오프셋 없이 일반 이미지로 표시합니다. 원본의 40px 모서리 곡률을 가로·세로 비율로 환산한 클리핑만 적용하고 별도 검정 배경을 덧대지 않아 좌우 끝단과 둥근 모서리가 겹치지 않습니다. 일정 원본 크롭은 `(60,1455,1086,567)`, 경기 정보는 `(60,594,1086,711)`, 라인업은 `(60,1080,1086,1404)`이며 모두 폭 724px로 비율 유지 압축했습니다.

## 이미지 제작

내장 imagegen 도구로 경기장 연출 이미지 두 개를 만들고 프로젝트 내부에 WebP로 저장했습니다.
원본을 교체하지 않고 신규 파일로 추가했습니다. 사진 아래에는 AI 연출 이미지임을 명시했습니다.

- `public/product/memory-stadium.webp`: 노을 아래 경기장을 바라보는 사진, 960×640.
- `public/product/memory-supporter.webp`: 파란 응원 머플러를 든 팬, 800×534.

최종 생성 프롬프트:

```text
Use case: photorealistic-natural. Asset type: an illustrative stadium photograph for KICKON football fan attendance-memory landing page. Create one wide 3:2 editorial photograph seen from a spectator seat in a contemporary Korean football-only stadium at late golden hour. The vivid green regulation football pitch fills middle foreground, compact full stands curve around the far touchline, soft warm sun at left, pale blue sky, clean realistic architecture, a few tiny distant footballers. In lower foreground include an out-of-focus blue fan scarf and seat rail without lettering. Natural candid smartphone photography, authentic textures, restrained color grading, no HDR. This is an illustrative scene, no named stadium, no identifiable faces, no club insignia, no logos, no text, no watermarks, no UI, no collage.
```

```text
Use case: photorealistic-natural. Asset type: second illustrative fan memory photo on KICKON website. A candid close-up editorial smartphone photograph of a supporter holding a plain blue football scarf up with both hands at a Korean football stadium after a match at blue hour. Photograph from behind at shoulder level, head mostly out of frame, no recognizable faces. Scarf no words or symbols. Floodlights illuminate green football pitch and softly out-of-focus blue seating in distance. Natural real texture, emotionally warm but restrained, realistic smartphone photograph, 3:2 landscape. No text, no logos, no identifiable players, no named stadium, no watermark, no UI, no collage.
```

새 영상이 없어도 CSS와 기존 로고만으로 완성된 연출이므로 별도 영상 제작은 필수가 아닙니다.
출시 자료를 갱신할 때에는 최신 앱 캡처와 사용 허락을 받은 실제 직관 사진으로 교체할 수 있습니다.

## O 축구공 이미지 (현재 미사용)

내장 imagegen 편집 도구로 기존 ON 로고를 참고해 N을 제거하고 O의 축구공과 블루 링만 분리했습니다. 투명 알파를 유지한 768×768 WebP를 `public/branding/kickon-football-o.webp`에 저장했습니다. 원본 ON 로고는 교체하지 않았습니다.

최종 편집 프롬프트:

```text
Use case: precise-object-edit. Edit target: the supplied KICKON ON transparent logo. Remove the entire N letter and everything associated with N. Preserve and isolate ONLY the O football: a glossy three-dimensional classic black-and-white football encircled by its existing luminous cyan-blue circular ring and thin cyan diagonal orbital swoosh. Keep the football panel geometry, black and white panels, polished material, blue illumination and same angle recognizable from the supplied logo. Complete the small right arc of the ring naturally where N previously overlapped it. Center the isolated O football in a square image and enlarge it to occupy about 85% of the square with room for the entire orbital swoosh, crisp edges. Genuinely transparent background including space outside the ring; no navy/blue square, no extra sphere behind the football, no N, no letters, no text, no ground plane, no shadow baked into background. Output a high-resolution clean isolated bitmap asset for the website.
```

## 연결

기존 프로젝트의 공식 다운로드 버튼에서 확인한 URL:

- App Store: https://apps.apple.com/kr/app/id6809176002
- Google Play: https://play.google.com/store/apps/details?id=kr.kickon.app

히어로와 다운로드 섹션은 `src/stores.ts`의 동일한 공식 주소를 사용합니다. 히어로 하단의 떠 있는 메뉴는 제거했습니다.
푸터 서비스 소개만 실제 섹션 앵커에 연결합니다. 개인정보·약관·문의 URL은 확보 전까지 일반 텍스트입니다.

푸터는 앱의 밝은 배경용 자산 `src/assets/branding/splash-logo_Light.webp`를 `public/branding/kickon-wordmark-light.webp`로 복사해 사용합니다. 검정색으로 만드는 필터는 제거했으며 원본 축구공과 블루 링 색상을 유지합니다. 로고·링크·저작권 문구의 세로 중심을 맞추고 푸터 위아래 패딩을 28px로 통일했습니다. 랜딩페이지의 제목·본문·캡션·예시 메시지 및 메타 설명에서 문장 끝 온점을 제거했습니다.

## 검증

- `npm run build`, `npm run lint`.
- Chrome에서 데스크톱, 768px 태블릿, 390px·320px 모바일 뷰포트를 확인.
- 팀 선택의 화면·색상·aria-pressed 변경, Enter 키 선택 확인.
- 히어로 영상 화면 밖 정지와 돌아왔을 때 재생, 반복 CSS 모션 화면 밖 정지 확인.
- 새 이미지 로드, 가로 넘침, 텍스트 잘림, 브라우저 콘솔 확인.
- 본문과 새 버튼의 주요 색상 대비 계산: 모두 4.5:1 이상.

실제 iOS/Android 기기, 운영 배포, 실시간 API 연동과 동작 줄이기 OS 설정 전환은 이번 검증에 포함하지 않습니다.
