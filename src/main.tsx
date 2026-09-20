import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AccountDeletionPage } from './legal/AccountDeletionPage.tsx'
import { PrivacyPage } from './legal/PrivacyPage.tsx'
import { TermsPage } from './legal/TermsPage.tsx'

const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'

const route = {
  '/': { component: App, title: '킥온 | K리그 커뮤니티' },
  '/terms': { component: TermsPage, title: '이용약관 | KICKON' },
  '/privacy': { component: PrivacyPage, title: '개인정보 처리방침 | KICKON' },
  '/account-deletion': {
    component: AccountDeletionPage,
    title: '계정 삭제 요청 | KICKON',
  },
}[normalizedPath] ?? { component: App, title: '킥온 | K리그 커뮤니티' }

document.title = route.title
const RootPage = route.component

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootPage />
  </StrictMode>,
)
