import { PrivacyPage } from "./legal/PrivacyPage";
import { TermsPage } from "./legal/TermsPage";
import { AccountDeletionPage } from "./legal/AccountDeletionPage";

export function getLegalPage(pathname: string) {
  switch (pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "")) {
    case "/privacy": return PrivacyPage;
    case "/terms": return TermsPage;
    case "/account-deletion": return AccountDeletionPage;
    default: throw new Error(`Unknown legal page: ${pathname}`);
  }
}
