import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { createElement, StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const EMPTY_ROOT = '<div id="root"></div>';
const SEO_START = "<!-- seo-head:start -->";
const SEO_END = "<!-- seo-head:end -->";

function occurrenceCount(value, token) {
  return value.split(token).length - 1;
}

export function replaceRoot(html, markup) {
  if (occurrenceCount(html, EMPTY_ROOT) !== 1) {
    throw new Error("Missing empty root marker");
  }

  return html.replace(EMPTY_ROOT, () => `<div id="root">${markup}</div>`);
}

export function replaceSeoHead(html, head) {
  if (
    occurrenceCount(html, SEO_START) !== 1 ||
    occurrenceCount(html, SEO_END) !== 1
  ) {
    throw new Error("Missing SEO head marker");
  }

  const start = html.indexOf(SEO_START);
  const end = html.indexOf(SEO_END, start);

  if (end < start) {
    throw new Error("Missing SEO head marker");
  }

  return `${html.slice(0, start)}${SEO_START}\n${head}\n${SEO_END}${html.slice(
    end + SEO_END.length,
  )}`;
}

function validateRequiredSeo(seo) {
  for (const key of ["title", "description", "canonical", "robots"]) {
    if (typeof seo[key] !== "string" || seo[key].trim() === "") {
      throw new Error(`Missing SEO field: ${key}`);
    }
  }
}

function validateAbsoluteStructuredData(structuredData) {
  const graph = structuredData?.["@graph"];

  if (!Array.isArray(graph) || graph.length === 0) {
    throw new Error("Invalid JSON-LD graph");
  }

  for (const entry of graph) {
    for (const key of ["@id", "url", "logo", "downloadUrl"]) {
      if (!(key in entry)) continue;

      const values = Array.isArray(entry[key]) ? entry[key] : [entry[key]];
      if (values.some((value) => typeof value !== "string" || !/^https:\/\//.test(value))) {
        throw new Error(`JSON-LD ${key} must use an absolute URL`);
      }
    }
  }
}

function validateRenderedHtml(html, route, structuredData) {
  if (!/<div id="root">[\s\S]+<\/div>/.test(html)) {
    throw new Error("root must not be empty");
  }

  if (!html.includes('<link rel="canonical" href="https://kickon.kr/')) {
    throw new Error("canonical must use kickon.kr");
  }

  const expectedRobots =
    route.path === "/account-deletion/" ? "noindex, follow" : "index, follow";
  if (!html.includes(`<meta name="robots" content="${expectedRobots}" />`)) {
    throw new Error(`Unexpected robots policy for ${route.path}`);
  }

  if (route.path === "/") {
    const match = html.match(
      /<script type="application\/ld\+json">([\s\S]+?)<\/script>/,
    );
    if (!match) {
      throw new Error("Missing main JSON-LD");
    }

    const parsed = JSON.parse(match[1]);
    validateAbsoluteStructuredData(parsed);
    validateAbsoluteStructuredData(structuredData);
  } else if (html.includes('type="application/ld+json"')) {
    throw new Error(`Unexpected JSON-LD for ${route.path}`);
  }
}

export async function prerender() {
  const server = await createServer({
    appType: "custom",
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true, hmr: false, ws: false },
  });

  try {
    const { SITE_ROUTES } = await server.ssrLoadModule("/src/site-routes.tsx");
    const { SEO_BY_PATH, renderSeoHead } = await server.ssrLoadModule("/src/seo.ts");

    for (const route of SITE_ROUTES) {
      const seo = SEO_BY_PATH[route.path];
      if (!seo) {
        throw new Error(`Unknown prerender route: ${route.path}`);
      }

      validateRequiredSeo(seo);
      const outputPath = resolve("dist", route.outputFile);
      const template = await readFile(outputPath, "utf8");
      const markup = renderToString(
        createElement(StrictMode, null, createElement(route.component)),
      );
      const withRoot = replaceRoot(template, markup);
      const finalHtml = replaceSeoHead(withRoot, renderSeoHead(seo));

      validateRenderedHtml(finalHtml, route, seo.structuredData);
      await writeFile(outputPath, finalHtml, "utf8");
    }
  } finally {
    await server.close();
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
const modulePath = resolve(decodeURIComponent(new URL(import.meta.url).pathname));

if (invokedPath === modulePath) {
  await prerender();
}
