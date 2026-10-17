import { ArrowUpRight, FileText, ShieldCheck, UserRoundMinus } from 'lucide-react';
import { landingRoute } from '../landing-routes';
import { TermsPage } from '../legal/TermsPage';
import { PrivacyPage } from '../legal/PrivacyPage';
import { AccountDeletionPage } from '../legal/AccountDeletionPage';
import '../legal/legal-page.css';

const documents = [
  { href: '/terms', title: '이용약관', description: '킥온 서비스 이용에 필요한 기본 약속과 이용 조건을 안내합니다.', Icon: FileText },
  { href: '/privacy', title: '개인정보 처리방침', description: '개인정보를 수집하고 이용하며 보호하는 방법을 확인하세요.', Icon: ShieldCheck },
  { href: '/account-deletion', title: '계정 삭제 요청', description: '계정과 활동 기록을 삭제하는 방법과 처리 범위를 안내합니다.', Icon: UserRoundMinus },
];

export function PolicyHubView() {
  return <main className="product-view policy-hub" aria-labelledby="policy-title">
    <header className="policy-heading">
      <h1 className="headline product-title" id="policy-title"><span>킥온 이용 안내</span></h1>
      <p>서비스 이용에 필요한 내용을 확인해 보세요.</p>
    </header>
    <div className="policy-cards">
      {documents.map(({ href, title, description, Icon }, index) => <a className="policy-card" href={href} key={href}>
        <div className="policy-card-top"><Icon size={30} strokeWidth={1.4} aria-hidden="true" /><span>0{index + 1}</span></div>
        <h2>{title}</h2><p>{description}</p>
        <span className="policy-card-link">자세히 보기<ArrowUpRight size={18} aria-hidden="true" /></span>
      </a>)}
    </div>
  </main>;
}

export function LegalDocumentView({ path }: { path: string }) {
  const route = landingRoute(path);
  return <div className="product-view legal-view">{route === 'terms' ? <TermsPage /> : route === 'privacy' ? <PrivacyPage /> : <AccountDeletionPage />}</div>;
}
