import type { ReactNode } from "react";
import "./legal-page.css";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  title: string;
  description: string;
  effectiveDate: string;
  sections: LegalSection[];
  notice?: ReactNode;
  version?: string;
  lastUpdatedDate?: string;
};

export function LegalPage({
  title,
  description,
  effectiveDate,
  sections,
  notice,
  version,
  lastUpdatedDate,
}: LegalPageProps) {
  return (
    <div className="legal-site">
      <a className="legal-skip-link" href="#legal-main">본문으로 바로가기</a>

      <header className="legal-header">
        <a className="legal-brand" href="/" aria-label="KICKON 홈">
          <img src="/branding/kickon-logo.webp" alt="KickON" width="132" height="44" />
        </a>
      </header>

      <main className="legal-main" id="legal-main">
        <header className="legal-document-header">
          <p className="legal-eyebrow">KICKON 이용자 안내</p>
          <h1>{title}</h1>
          <p className="legal-description">{description}</p>

          <dl className="legal-document-meta">
            {version ? <div><dt>버전</dt><dd>{version}</dd></div> : null}
            <div><dt>시행일</dt><dd>{effectiveDate}</dd></div>
            {lastUpdatedDate ? <div><dt>최종 수정일</dt><dd>{lastUpdatedDate}</dd></div> : null}
          </dl>
        </header>

        {notice ? <aside className="legal-notice">{notice}</aside> : null}

        <div className="legal-layout">
          <nav className="legal-toc" aria-label={`${title} 목차`}>
            <strong>목차</strong>
            <ol>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{index + 1}. {section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="legal-article">
            {sections.map((section, index) => (
              <section
                className="legal-section"
                id={section.id}
                key={section.id}
                aria-labelledby={`${section.id}-title`}
              >
                <h2 id={`${section.id}-title`}>{index + 1}. {section.title}</h2>
                <div className="legal-section-content">{section.content}</div>
              </section>
            ))}
          </article>
        </div>
      </main>

      <footer className="legal-footer">
        <nav aria-label="법적 고지">
          <a href="/terms/">이용약관</a>
          <a href="/privacy/">개인정보 처리방침</a>
          <a href="/account-deletion/">계정 삭제 요청</a>
        </nav>
        <p>© 2026 KICKON. All rights reserved.</p>
      </footer>
    </div>
  );
}

export function LegalTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="legal-table-wrap">
      <table>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
