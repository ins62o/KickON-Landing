# 슬래시 없는 주소

홈(`/`)을 제외한 페이지는 `/features`, `/matchday`, `/policies`, `/terms`, `/privacy`, `/account-deletion`으로 연결합니다. 예전 끝 슬래시·index.html 주소로 접속하면 React에서 history.replaceState로 정규화합니다. 쿼리와 해시는 보존합니다. 내부 이동은 계속 SPA 방식입니다.

개발 서버와 Vite preview는 해당 주소를 내부적으로 각 폴더의 index.html에 연결하므로 새로고침해도 슬래시를 추가하지 않습니다. 기존 다중 HTML 빌드 파일은 유지합니다.

## S3/CloudFront 운영 배포

정적 파일만 업로드하는 배포에 더해, `hosting/cloudfront-routing.js`의 요청 변환을 CloudFront Viewer request에 연결해야 합니다. 브라우저 주소를 바꾸지 않고 `/matchday` 요청을 S3의 `/matchday/index.html` 객체로 연결합니다. 쿼리와 정적 자산 경로는 유지합니다. 기존 Viewer request 함수가 있으면 덮어쓰지 말고 해당 분기를 병합해야 합니다.

이 작업에서는 AWS 운영 설정을 변경하거나 배포하지 않았습니다. 운영 반영 전에는 직접 주소 열기·새로고침·예전 주소 접속과 브라우저 뒤로 가기를 확인합니다.

공식 예시: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/example_cloudfront_functions_url_rewrite_single_page_apps_section.html
