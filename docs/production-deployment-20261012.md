# 2026-10-12 운영 배포 준비

사용자가 현재 랜딩페이지 운영 배포를 요청했습니다. 대상 사이트는 `https://kickon.kr`이며 기존 응답은 Amazon S3와 CloudFront입니다.

배포 방식: 사용자가 확인한 기존 `Prod` 브랜치 푸시 자동 배포를 사용합니다. AWS 콘솔 로그인은 필요하지 않습니다. 직접 S3 업로드나 CloudFront 설정 변경은 수행하지 않습니다.

현재 상태: 최신 리뉴얼 소스 검사 완료, `Prod` 커밋·푸시 준비. 푸시 후 운영 HTML과 신규 자산을 확인합니다.

## 이미지 경계 수정 이후의 최신 배포 후보

- 최신 ZIP: `/private/tmp/kickon-landing-release-20261012-card-edges/landing.zip`, 52개 파일, 1,815,304 bytes.
- 최신 ZIP SHA-256: `3777e680bef8ddce13d74cbe957a1d44388162913d9785848a74c92055e7814f`.
- 최신 파일별 해시: 같은 디렉터리의 `manifest.json`.
- 이미지 크롭과 좌우 모서리 수정 이후 빌드·린트 통과, 데스크톱/390px/320px에서 원본 비율과 양 끝 정렬을 확인했습니다.
- 아래 준비 결과의 이전 ZIP은 보존했으며 배포 시에는 위 최신 후보를 사용합니다. 기존 운영 HTML 백업 위치는 그대로입니다.

## 준비 결과

- `npm run build`, `npm run lint`, `npm test` 통과, 테스트 5개 성공.
- 공개 `public_landing_stats()` 조회 성공: 사용자 1,248명, GPS 직관 인증 87건. 현재 표시 기준은 `1,200+`, `80+`.
- 배포 ZIP: `/private/tmp/kickon-landing-release-20261012/landing.zip`, 49개 파일, 1,721,968 bytes.
- ZIP SHA-256: `72936ebfea74c6f8e136a4150db9249e05bdaa34f1dac5017ed9def2c710e8dd`.
- 파일별 해시 목록: 같은 디렉터리의 `manifest.json`.
- 기존 운영 HTML 백업: 같은 디렉터리의 `previous-index.html`, 기존 해시 자산 목록은 `previous-site.json`.
- 검증 결과: 같은 디렉터리의 `readiness.json`.

## 배포 절차

기존 리뉴얼 요청에 따라 삭제된 이전 화면과 새 소스·자산을 함께 커밋합니다. `.env.local`, 도구 설정, Supabase CLI 임시 파일은 제외합니다. `.env.production`에는 공개 브라우저 설정 두 개만 포함해 자동 빌드에서도 실제 집계를 연결합니다. 원격 `Prod`와 동일한 기준 커밋임을 확인한 뒤 일반 푸시로 자동 배포를 시작합니다. 강제 푸시는 사용하지 않습니다.

푸시 후 운영 제목, 새 JS/CSS 자산, 앱 카드 이미지, 푸터 로고와 공개 집계를 확인합니다. 실제 반영이 확인되기 전에는 배포 완료로 보고하지 않습니다. 기존 운영 HTML 백업은 로컬에 보존했습니다. 이전에 준비한 ZIP은 참고용이며 실제 배포는 소스 푸시로 진행합니다.

DB migration, Edge, 관리자 앱, IAM, DNS 또는 CloudFront 라우팅 설정 변경은 이 작업에 포함하지 않습니다.
