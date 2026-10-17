# 킥온 문의 메일 활성화

## 연결 상태 — 2026-10-17

- 운영 Supabase 프로젝트 `smihjaucucffmsbktnmp`에 문의 전송 제한 SQL과 `landing-contact` 함수를 배포했습니다
- 발신 주소와 허용 Origin을 설정하고, `kickon.kr` 발신 도메인을 AWS Route 53의 인증 레코드 3개로 Verified 인증했습니다
- Resend의 `kickon-landing-contact` 키는 Sending access 및 `kickon.kr` 도메인으로 제한했습니다. 키는 Supabase의 서버 Secret에만 저장했으며 임시 파일은 삭제했습니다
- `http://localhost:5174`의 실제 문의 모달에서 승인된 테스트 문의 1건을 전송했고 접수 완료 화면을 확인했습니다
- Resend에서 2026-10-17 22:14 KST의 Sent·Delivered 이벤트를 확인했습니다. 발신 `KICKON <contact@kickon.kr>`, 수신·테스트 Reply-To `kickon.offical@gmail.com`이 일치합니다
- 테스트 메일 ID: `01a14a00-2ca7-7d3a-bf5b-a153eef07485`
- Delivered는 Gmail 수신 서버의 수락을 의미합니다. Gmail 받은편지함·스팸함에서의 위치는 직접 열어 확인하지 않았습니다
- 공개 `https://kickon.kr`은 기존 정적 화면을 제공 중입니다. 이번 작업에서 공개 사이트 파일은 교체하지 않았으며 새 문의 모달을 공개하려면 최신 정적 사이트의 S3/CloudFront 반영이 별도로 필요합니다

문의 서버의 연결과 실제 발송 검증은 완료되었습니다. 아래는 재설정 시 참고할 연결 절차입니다.

## 1. Resend에서 준비

1. https://resend.com 에서 계정을 만듭니다.
2. Domains에 `kickon.kr`을 등록하고, Resend가 표시하는 발신용 DNS 레코드를 도메인 관리 화면에 등록합니다. 기존 수신용 MX 레코드는 변경하지 않습니다.
3. 도메인이 Verified가 되면 해당 도메인에만 발송 가능한 API 키를 만듭니다. API 키는 채팅이나 프론트엔드 `.env`에 넣지 않습니다.

발신 주소는 `KICKON <contact@kickon.kr>`, 수신 주소는 코드에 고정된 `kickon.offical@gmail.com`입니다. 방문자가 입력한 이메일은 Reply-To로 설정됩니다.

## 2. 기존 Supabase 프로젝트에 연결

서버 Secrets에 다음 값을 넣습니다.

| 이름 | 값 |
| --- | --- |
| RESEND_API_KEY | Resend에서 만든 비밀 키 |
| CONTACT_FROM_EMAIL | `KICKON <contact@kickon.kr>` |
| CONTACT_ALLOWED_ORIGINS | `https://kickon.kr,https://www.kickon.kr` |

`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`는 호스팅된 Edge Function의 기본 서버 환경 변수를 사용합니다. 비밀 키를 브라우저에 전달하지 않습니다.

Supabase SQL Editor에서 **`supabase/migrations/20261017000000_landing_contact_limits.sql` 한 파일만** 검토 후 실행합니다. 다른 기존 마이그레이션을 일괄 적용하지 않습니다. 회원·직관 데이터는 수정하지 않습니다.

이후 프로젝트를 명시해 함수만 배포합니다.

```sh
supabase functions deploy landing-contact --project-ref YOUR_PROJECT_REF
```

`supabase/config.toml`은 로그인 없이 사용할 문의 폼을 위해 이 함수에만 JWT 검사를 끕니다. 수신 주소 고정, 허용 Origin, 서버 입력 검증, 지속되는 전송 제한을 함수 안에서 처리합니다. 공개 API 키 자체는 스팸 차단 장치가 아닙니다.

현재 로컬 확인을 위해 CONTACT_ALLOWED_ORIGINS에 `http://localhost:5173`, `http://localhost:5174`, `http://127.0.0.1:4186`을 명시적으로 추가했습니다. 운영 설정에서는 로컬 Origin을 제거합니다. Supabase 게이트웨이의 X-Forwarded-For가 실제 접속자를 반영하는지도 배포 환경에서 확인합니다. IP별 한도와 별개로 전역 한도가 적용됩니다.

## 3. 최종 확인

프론트엔드는 기존 VITE_SUPABASE_URL과 VITE_SUPABASE_PUBLISHABLE_KEY를 그대로 사용합니다. 새 라이브러리는 필요 없습니다. 변경된 정적 사이트는 기존 S3/CloudFront 배포 절차로 반영합니다.

- 실제 테스트 문의 한 건을 보내 Resend 접수 ID, 발송 상태, Gmail 수신과 답장 주소를 확인합니다.
- 실패 시 성공 안내가 나타나지 않고 작성 내용이 남는지 확인합니다.
- 같은 내용의 네트워크 오류 재시도는 같은 전송 번호를 사용합니다. Resend 중복 방지는 24시간 유지됩니다.

클라이언트·함수 검증에서는 가짜 공급자 응답으로 성공·실패·시간초과·입력 오류·전송 제한 분기를 확인했습니다. 별도 임시 PostgreSQL에서 SQL을 실행해 RLS·권한 제한·IP별 3회·전체 60회 한도·만료 정리를 확인했습니다. 운영 SQL 적용 후에도 일반 방문자는 제한 함수를 호출할 수 없고 서버 역할만 호출 가능한지 확인했습니다. Edge 함수는 운영 프로젝트에 배포되었으며 허용 Origin의 OPTIONS 응답이 204인지 확인했습니다. 도메인 인증과 실제 웹 문의 전송, Resend의 수신 서버 전달 완료(Delivered)까지 확인했습니다. Gmail 폴더 위치는 직접 확인하지 않았습니다.

## 전송 제한과 보관

IP 해시별 10분 구간당 3회, 전체 시간 구간당 60회 시도로 제한합니다. 경계 시각에는 다음 구간 한도가 시작됩니다. 제한 저장소에 문제가 생기면 발송을 중단합니다. IP는 서버 비밀 값을 섞은 해시로만 카운터에 저장하고 문의 본문·이메일·원본 IP는 이 테이블에 저장하지 않습니다. 만료 카운터는 다음 요청 때 정리됩니다. 문의 본문은 발송을 위해 Resend와 수신 Gmail로 전송됩니다.

## 공식 문서

- https://supabase.com/docs/guides/functions/examples/send-emails
- https://supabase.com/docs/guides/functions/secrets
- https://supabase.com/docs/guides/functions/auth
- https://resend.com/docs/api-reference/emails/send-email
