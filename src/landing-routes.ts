export type LandingRoute = 'home' | 'features' | 'matchday' | 'policies' | 'terms' | 'privacy' | 'account-deletion';

export function landingRoute(pathname: string): LandingRoute | null {
  const path = pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '');
  if (path === '') return 'home';
  if (path === '/features') return 'features';
  if (path === '/matchday') return 'matchday';
  if (path === '/policies') return 'policies';
  if (path === '/terms') return 'terms';
  if (path === '/privacy') return 'privacy';
  if (path === '/account-deletion') return 'account-deletion';
  return null;
}

export function canonicalLandingPath(pathname: string): string | null {
  const route = landingRoute(pathname);
  return route === 'home' ? '/' : route ? `/${route}` : null;
}
