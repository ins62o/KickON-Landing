# 킥온 제품 소개 섹션

기존 히어로의 크기, 영상과 ON 로고를 보존했습니다. 이후 요청에 따라 전체 글꼴은 Pretendard로 변경하고 히어로의 시작 버튼은 두 스토어 다운로드 버튼으로 교체했습니다. 메인 카피는 ‘K리그가 일상이 되는 순간’이며 화면 크기에 따라 글자 크기를 조절해 한 줄로 표시합니다. 스토어 버튼은 높이 54px(모바일 52px)로 키웠고 하단의 떠 있는 메뉴는 제거했습니다.
팀 데이터와 29개 팀 구성은 유지합니다. 팀 마키는 마우스를 올려도 계속 흐르며 색상만 바뀌고, 팀 카드와 이름 위에서는 손가락 커서를 표시합니다.
삭제된 이전 홈페이지 섹션은 복원하지 않았습니다. 이후 푸터 연결 요청에 따라 Git의 `4f1430f`에서 개인정보 처리방침·이용약관과 이 문서들이 연결하는 계정 삭제 요청 안내 원문을 복원했습니다. 법적 문서 본문과 날짜, 버전은 변경하지 않았습니다.
새 패키지를 설치하지 않았습니다.

## 모션

- 경기 정보: Motion `useScroll`로 일정, 스코어, 라인업, 실제 앱 화면을 서로 다른 진행률에서 표시합니다. 카드의 translateY와 scale만 변경하며 opacity는 항상 유지합니다. 왼쪽 카드 세 개는 실제 앱 캡처 일부를 표시하고, 오른쪽은 경기 상세 화면입니다. 축구공 장식은 제거했습니다. 카드와 폰은 CSS Grid로 배치하며 라인업 이미지 높이에 맞춰 영역이 자동으로 늘어납니다. 하단 네 기능 목록은 제거하고 오른쪽 폰도 동일한 흰 카드로 감싸고 상단에 파란 휴대폰 아이콘과 ‘상세 화면’ 제목을 표시합니다. 폰 아래 캡션은 제거했습니다. 카드 패딩을 포함하도록 그리드 열 폭을 조정하고 모바일에서는 폰을 카드 내부 폭에 맞춥니다.
- 직관 기록: 티켓 연출을 제거하고 직관 인증 후 사진과 한 줄 기록이 저장된 실제 ‘직관 기록’ 앱 캡처를 가운데 폰에 표시합니다. 경기 결과와 사진, 한 줄 기록 UI를 그대로 사용합니다. 가운데 폰은 마우스를 올려도 확대되지 않고, 양옆 사진에만 포인터 커서와 1.12배 확대 효과를 적용합니다. 터치 환경에는 hover 효과를 적용하지 않습니다. 사진 두 장은 양옆에 배치하고 모바일에서는 인증 화면 아래로 이동합니다. 다음 영역의 직관 기록 화면 하단 캡션은 제거했습니다. 스크롤 중 화면을 흐리게 만드는 opacity 효과는 사용하지 않습니다.
- 커뮤니티: TV 프레임과 받침은 유지하고 페이지 번호·이전/다음·재생/일시정지 조작부를 제거했습니다. PC에서는 왼쪽 15개·오른쪽 14개 팀을 각각 별도 트랙에 배치하고, 각 열의 댓글 묶음을 두 번 반복해 CSS transform으로 아래로 천천히 흐르게 표시합니다. 마지막 화성 옆에 빈 슬롯이 생기던 단일 그리드는 제거했습니다. 각 열은 마지막 팀 다음에 해당 열의 첫 팀이 바로 이어지며 주기는 왼쪽 210초·오른쪽 196초입니다. 모바일에서는 한 열에 29개 팀 전체를 배치하고 406초 주기로 반복합니다. 각 트랙의 원본과 복제 묶음은 동일한 내용·크기·마지막 간격을 유지합니다. 팀 색상은 `src/teams.ts`에서 가져와 말풍선 배경에 16%, 테두리에 32% 비율로 흰색과 혼합합니다. 댓글은 좌우 꼬리 없이 이전 카드 형태로 표시합니다. 모서리는 PC 22px·모바일 18px이며 한쪽 아래 모서리만 6px로 적용합니다. 화면 밖에서는 움직임을 정지하고 opacity나 흐림 효과는 사용하지 않습니다.
- 다운로드: 기존 ON 앱 아이콘에 블루 글로우와 작은 수직 부유 움직임을 적용했습니다. 아이콘은 회전하지 않고 반듯하게 표시합니다.
- 과도한 스크롤 고정이나 가로 스크롤 연출은 사용하지 않습니다.

## 접근성과 성능

모바일에서는 스크롤 카드 변환을 제거하고 세로 순서로 즉시 읽을 수 있게 표시합니다. 반복 움직임도 정지합니다.
`prefers-reduced-motion`에서는 스크롤 변환과 반복 움직임 없이 내용을 보여줍니다.
CSS 반복 모션은 Motion의 `useInView`로 화면 밖에서 정지하고, 히어로 영상은 IntersectionObserver와 문서 visibilitychange로 재생을 제어합니다. Observer와 이벤트 리스너는 정리합니다.
커뮤니티의 응원 말풍선은 읽을 수 있는 텍스트로 표시하고 반복 복제본만 `aria-hidden`으로 숨깁니다. 동작 줄이기 설정에서는 애니메이션과 복제본을 제거하고 TV 화면 내부를 직접 스크롤해 29개 팀의 메시지를 읽을 수 있습니다. 화면 교체 타이머는 사용하지 않으며, 화면 크기 감지 리스너는 컴포넌트 해제 시 정리합니다.
이미지에는 크기를 예약했고, 새 섹션 이미지에는 lazy loading을 적용했습니다.
실제 앱 캡처와 사진은 WebP로 압축해 사용합니다. O 축구공 이미지는 현재 페이지에서 사용하지 않습니다.

## 앱 화면과 시연 데이터

`public/product/`의 match-detail, community-incheon, community-ulsan, community-busan-ipark는 기존 프로젝트 백업의 실제 앱 화면을 크기 조절하고 WebP로 압축한 것입니다. 새로운 가짜 앱 스크린샷을 만들지 않았습니다. `attendance-history.webp`는 앱 프로젝트의 `marketing/app-store/2026-10-12/reference-six-teams-no-periods-v9/sources/05_jeonbuk_history.png`를 804×1748로 압축한 실제 앱 캡처로 갱신했습니다. 무승부 숫자와 라벨이 회색인 앱 UI를 그대로 사용하며 승리·패배·승률 색상은 유지합니다. 직관 기록 안내의 1·2·3 번호는 모두 같은 파랑(#1d4ed8) 배경과 흰 숫자로 표시합니다. 24×24px 원 안에서 flex 가운데 정렬, line-height 1, lining/tabular 숫자를 적용합니다.
앱 화면 속 경기와 게시물은 촬영용 예시 데이터이며 현재 실시간 경기 데이터가 아닙니다. 사용자 요청에 따라 화면의 예시 데이터·시연 안내 문구는 제거하고 제작 정보는 이 문서에 보존합니다.
`public/product/match-fixtures.webp`, `public/product/match-preview-detail.webp`는 앱 프로젝트의 `marketing/jeonmoal/2026-10-09/sources/fixtures.png`, `match-detail.png` 실제 캡처를 압축한 이미지입니다. 현재 일정·스코어 카드는 원본 PNG에서 카드 영역만 픽셀 단위로 잘라낸 `match-schedule-card.webp`(724×378), `match-score-card.webp`(724×474)를 사용합니다. 화면 내용을 재생성하지 않습니다.
주변 응원 메시지는 기능 시연이며 실제 이용자 게시물로 표시하지 않습니다. 이전에 사용한 GPS 인증 캡처 `public/product/attendance-certification.webp`는 현재 표시하지 않습니다. 현재 가운데 폰 이미지는 앱 프로젝트의 `marketing/app-store/2026-10-12/reference-six-teams-no-periods-v9/sources/06_jeonbuk_memory.png`를 804×1748 WebP로 압축한 `public/product/attendance-memory.webp`입니다. 사진 추가 편집기 캡처 `public/product/attendance-photo-upload.webp`는 현재 표시하지 않습니다. 원본 앱 UI는 변경하지 않았습니다.
`public/product/match-lineup.webp`는 2026-10-12에 `KICKON Jeonmoal Capture 20261009` iOS 27 시뮬레이터에서 실제 앱을 열고 라인업까지 스크롤해 새로 촬영한 이미지입니다. 기존 `kickon-dev://qa/store?team=jeonbuk` 메모리 기반 QA 시나리오를 사용했습니다. 현재 표시는 이 원본에서 카드만 잘라낸 `match-lineup-card.webp`(724×936)를 사용하며 포메이션과 양 팀 선발 선수 22명 전체를 포함합니다. 원본 1206×2622 PNG는 `docs/captures/2026-10-12/match-lineup.png`에 보존했습니다. 앱 코드나 운영 데이터는 변경하지 않았으며 화면을 재생성하거나 선수 이름을 덧그리지 않았습니다.

세 이미지 모두 절대 위치와 비율 오프셋 없이 일반 이미지로 표시합니다. 원본의 40px 모서리 곡률을 가로·세로 비율로 환산한 클리핑만 적용하고 별도 검정 배경을 덧대지 않아 좌우 끝단과 둥근 모서리가 겹치지 않습니다. 일정 원본 크롭은 `(60,1455,1086,567)`, 경기 정보는 `(60,594,1086,711)`, 라인업은 `(60,1080,1086,1404)`이며 모두 폭 724px로 비율 유지 압축했습니다.

## 이미지 제작

내장 imagegen 도구로 경기장 연출 이미지 두 개를 만들고 프로젝트 내부에 WebP로 저장했습니다.
원본을 교체하지 않고 신규 파일로 추가했습니다. 사용자 요청에 따라 페이지의 제작 안내 문구는 제거하고 이미지 출처와 생성 프롬프트는 이 문서에 보존합니다.

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
푸터에는 개인정보처리방침(`/privacy/`)과 이용약관(`/terms/`) 링크만 표시합니다. 서비스 소개와 문의하기는 제거했습니다. 법적 문서는 별도 React 진입점으로 열리고 Vite 다중 페이지 빌드가 `privacy/index.html`, `terms/index.html`, `account-deletion/index.html`을 생성하므로 각 경로를 직접 열거나 새로고침할 수 있습니다. 법적 문서 CSS와 본문 코드는 메인 랜딩 번들에 포함하지 않습니다.

푸터는 검정 배경이 없는 투명 ON 로고 `public/branding/kickon-on-hires.webp`를 72×44px로 표시합니다. 원본의 투명 여백을 CSS object-fit으로 줄여 글자와 축구공을 선명하게 보여줍니다. 다운로드 섹션의 앱 아이콘은 유지합니다. 앞서 사용한 `kickon-wordmark-light.webp`는 현재 푸터에서 사용하지 않습니다. 로고·링크·저작권 문구의 세로 중심을 맞추고 푸터 위아래 패딩을 28px로 통일했습니다. 랜딩페이지의 제목·본문·캡션·예시 메시지 및 메타 설명에서 문장 끝 온점을 제거했습니다.

## 검증

- `npm run build`, `npm run lint`.
- Chrome에서 데스크톱, 768px 태블릿, 390px·320px 모바일 뷰포트를 확인.
- 초기 구현의 팀 선택 확인은 현재 제거된 기능의 과거 검증입니다. 현재 PC의 두 열과 모바일의 한 열에 29개 팀이 중복과 누락 없이 포함되는지, 각 열의 반복 묶음이 동일한지, 팀 엠블럼·팀 이름·문구·색상과 조작부 제거를 SSR 회귀 테스트로 확인합니다.
- 히어로 영상 화면 밖 정지와 돌아왔을 때 재생, 반복 CSS 모션 화면 밖 정지 확인.
- 새 이미지 로드, 가로 넘침, 텍스트 잘림, 브라우저 콘솔 확인.
- 본문과 새 버튼의 주요 색상 대비 계산: 모두 4.5:1 이상.

실제 iOS/Android 기기, 운영 배포, 실시간 API 연동과 동작 줄이기 OS 설정 전환은 이번 검증에 포함하지 않습니다.

2026-10-12 추가 수정: 흐림 효과·앱 아이콘 기울기·히어로 제목 줄바꿈·경기 영역 하단 기능 목록·직관 기록 폰 캡션을 제거하고 실제 GPS 직관 인증 화면을 추가했습니다. 빌드·린트·집계 테스트를 다시 확인하며, 이번 수정의 브라우저 시각 확인은 브라우저 연결이 없어 수행하지 못했습니다. 앞선 브라우저 검증 목록은 이전 구현의 검증 이력입니다.

다운로드 문구는 ‘당신의 K리그 일상, 킥온에서’ / ‘경기 소식과 팬들의 이야기, 직관의 순간까지 함께해요’로 변경했습니다. 두 스토어 버튼의 외부 링크 화살표와 관련 CSS를 제거하고 스토어 아이콘·이름만 표시합니다. 법적 문서는 랜딩과 같은 #f9fafb 배경에 어두운 본문, 파란 링크, 밝은 안내 박스와 표 색상을 사용하며 문서 내용은 변경하지 않았습니다.

랜딩 상단 로고·문의하기 헤더와 관련 스타일을 제거했습니다. 페이지 위쪽 여백은 16px이며 히어로부터 표시합니다. TV 댓글의 마지막 화성 FC 말풍선에도 다른 팀과 같은 열 폭을 적용하고 마지막 항목만 두 열을 차지하던 규칙은 제거했습니다.
