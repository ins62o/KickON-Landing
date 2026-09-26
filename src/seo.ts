export const SITE_ORIGIN = "https://kickon.kr";

export type SitePath = "/" | "/terms/" | "/privacy/" | "/account-deletion/";

export interface SeoDefinition {
  path: SitePath;
  title: string;
  description: string;
  canonical: string;
  robots: "index, follow" | "noindex, follow";
  includeInSitemap: boolean;
  openGraph: {
    title: string;
    image: string;
    imageWidth: 1200;
    imageHeight: 630;
  };
  twitterCard: "summary_large_image";
  structuredData?: Record<string, unknown>;
}

const DESCRIPTION =
  "K리그 경기 일정과 순위, 라인업·득점 알림을 확인하고 직관 인증과 경기 기록, 팀별 커뮤니티를 함께 즐겨보세요.";
const OG_IMAGE = `${SITE_ORIGIN}/branding/kickon-og.png`;

const APP_STORE_URL = "https://apps.apple.com/kr/app/id6809176002";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=kr.kickon.app";
const INSTAGRAM_URL = "https://www.instagram.com/kickon.offical/";

const commonOpenGraph = (title: string): SeoDefinition["openGraph"] => ({
  title,
  image: OG_IMAGE,
  imageWidth: 1200,
  imageHeight: 630,
});

export const SEO_BY_PATH: Record<SitePath, SeoDefinition> = {
  "/": {
    path: "/",
    title: "킥온 | K리그 커뮤니티·일정·순위·직관 기록",
    description: DESCRIPTION,
    canonical: `${SITE_ORIGIN}/`,
    robots: "index, follow",
    includeInSitemap: true,
    openGraph: commonOpenGraph("킥온 | 모두를 위한 K리그 커뮤니티"),
    twitterCard: "summary_large_image",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE_ORIGIN}/#website`,
          url: `${SITE_ORIGIN}/`,
          name: "KickON",
          alternateName: "킥온",
          inLanguage: "ko-KR",
        },
        {
          "@type": "Organization",
          "@id": `${SITE_ORIGIN}/#organization`,
          name: "KickON",
          alternateName: "킥온",
          url: `${SITE_ORIGIN}/`,
          logo: `${SITE_ORIGIN}/branding/kickon-app-icon.png`,
          sameAs: [INSTAGRAM_URL, APP_STORE_URL, GOOGLE_PLAY_URL],
        },
        {
          "@type": "MobileApplication",
          "@id": `${SITE_ORIGIN}/#app`,
          name: "KickON",
          alternateName: "킥온",
          applicationCategory: "SportsApplication",
          operatingSystem: "iOS, Android",
          description: DESCRIPTION,
          url: `${SITE_ORIGIN}/`,
          downloadUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
        },
      ],
    },
  },
  "/terms/": {
    path: "/terms/",
    title: "이용약관 | KICKON",
    description:
      "KickON 서비스 이용에 필요한 회원의 권리와 의무, 이용 조건과 운영 정책을 안내합니다.",
    canonical: `${SITE_ORIGIN}/terms/`,
    robots: "index, follow",
    includeInSitemap: true,
    openGraph: commonOpenGraph("이용약관 | KICKON"),
    twitterCard: "summary_large_image",
  },
  "/privacy/": {
    path: "/privacy/",
    title: "개인정보 처리방침 | KICKON",
    description:
      "KickON이 처리하는 개인정보의 항목, 이용 목적, 보관 기간과 이용자 권리를 안내합니다.",
    canonical: `${SITE_ORIGIN}/privacy/`,
    robots: "index, follow",
    includeInSitemap: true,
    openGraph: commonOpenGraph("개인정보 처리방침 | KICKON"),
    twitterCard: "summary_large_image",
  },
  "/account-deletion/": {
    path: "/account-deletion/",
    title: "계정 삭제 요청 | KICKON",
    description:
      "KickON 계정과 개인정보 및 활동 데이터를 삭제하는 방법과 처리 범위를 안내합니다.",
    canonical: `${SITE_ORIGIN}/account-deletion/`,
    robots: "noindex, follow",
    includeInSitemap: false,
    openGraph: commonOpenGraph("계정 삭제 요청 | KICKON"),
    twitterCard: "summary_large_image",
  },
};

export function getSeoDefinition(path: string): SeoDefinition {
  const definition = SEO_BY_PATH[path as SitePath];

  if (!definition) {
    throw new Error(`Unknown SEO path: ${path}`);
  }

  return definition;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function serializeStructuredData(data: Record<string, unknown>): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

export function renderSeoHead(definition: SeoDefinition): string {
  const title = escapeHtml(definition.title);
  const description = escapeHtml(definition.description);
  const canonical = escapeHtml(definition.canonical);
  const robots = escapeHtml(definition.robots);
  const ogTitle = escapeHtml(definition.openGraph.title);
  const ogImage = escapeHtml(definition.openGraph.image);
  const lines = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="KickON" />',
    '<meta property="og:locale" content="ko_KR" />',
    `<meta property="og:title" content="${ogTitle}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="${definition.openGraph.imageWidth}" />`,
    `<meta property="og:image:height" content="${definition.openGraph.imageHeight}" />`,
    `<meta name="twitter:card" content="${definition.twitterCard}" />`,
    `<meta name="twitter:title" content="${ogTitle}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
  ];

  if (definition.structuredData) {
    lines.push(
      `<script type="application/ld+json">${serializeStructuredData(definition.structuredData)}</script>`,
    );
  }

  return lines.join("\n");
}
