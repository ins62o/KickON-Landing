import type { ComponentType } from "react";
import App from "./App.tsx";
import { AccountDeletionPage } from "./legal/AccountDeletionPage.tsx";
import { PrivacyPage } from "./legal/PrivacyPage.tsx";
import { TermsPage } from "./legal/TermsPage.tsx";
import { getSeoDefinition, type SitePath } from "./seo.ts";

export interface SiteRoute {
  path: SitePath;
  outputFile: string;
  component: ComponentType;
  seo: ReturnType<typeof getSeoDefinition>;
}

const routeDefinitions: Array<Omit<SiteRoute, "seo">> = [
  { path: "/", outputFile: "index.html", component: App },
  { path: "/terms/", outputFile: "terms/index.html", component: TermsPage },
  { path: "/privacy/", outputFile: "privacy/index.html", component: PrivacyPage },
  {
    path: "/account-deletion/",
    outputFile: "account-deletion/index.html",
    component: AccountDeletionPage,
  },
];

export const SITE_ROUTES: SiteRoute[] = routeDefinitions.map((route) => ({
  ...route,
  seo: getSeoDefinition(route.path),
}));

export function normalizePathname(pathname: string): string {
  const clean = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  return clean ? `${clean}/` : "/";
}

export function getSiteRoute(pathname: string): SiteRoute {
  const normalized = normalizePathname(pathname);
  return SITE_ROUTES.find((route) => route.path === normalized) ?? SITE_ROUTES[0];
}
