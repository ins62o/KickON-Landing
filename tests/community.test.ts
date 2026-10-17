import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

async function createTestServer() {
  return createServer({
    configFile: false, cacheDir: `/private/tmp/kickon-landing-tests-${process.pid}`,
    appType: "custom",
    plugins: [react()],
    server: { middlewareMode: true, hmr: false, ws: false },
  });
}

test("all 29 TV cheers preserve team identity, colors and an existing emblem", async (t) => {
  const server = await createTestServer();
  t.after(() => server.close());
  const { communityMessages } = await server.ssrLoadModule("/src/community-messages.ts");
  const { teams } = await server.ssrLoadModule("/src/teams.ts");
  assert.equal(communityMessages.length, 29);
  assert.equal(new Set(communityMessages.map((entry: { slug: string }) => entry.slug)).size, 29);
  for (const { slug, name, color, message } of communityMessages) {
    const team = teams.find((team: { slug: string }) => team.slug === slug);
    assert.ok(team);
    assert.equal(name, team.name);
    assert.equal(color, team.color);
    assert.ok(message.trim().length > 0);
    await access(new URL(`../public/teams/hero/${slug}.webp`, import.meta.url));
  }
});

test("each TV lane loops independently without an empty slot, retaining all 29 teams", async (t) => {
  const server = await createTestServer();
  t.after(() => server.close());
  const { FanCommunity } = await server.ssrLoadModule("/src/FanCommunity.tsx");
  const { communityMessages, getCommunityColumns } = await server.ssrLoadModule("/src/community-messages.ts");
  const columns = getCommunityColumns(false);
  assert.deepEqual(columns.map((column: unknown[]) => column.length), [15, 14]);
  const combined = columns.flat();
  assert.equal(new Set(combined.map((entry: { slug: string }) => entry.slug)).size, 29);
  assert.deepEqual(new Set(combined.map((entry: { slug: string }) => entry.slug)), new Set(communityMessages.map((entry: { slug: string }) => entry.slug)));
  const mobile = getCommunityColumns(true);
  assert.equal(mobile.length, 1);
  assert.deepEqual(mobile[0], communityMessages);

  const html = renderToStaticMarkup(createElement(FanCommunity));
  const lanes = html.split(/<div class="community-tv-lane"[^>]*>/).slice(1);
  assert.equal(lanes.length, 2);
  for (const [laneIndex, lane] of lanes.entries()) {
    const [visible, duplicate] = lane.split('<div class="community-tv-messages" aria-hidden="true">');
    assert.ok(duplicate);
    const cards = [...visible.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(([card]) => card);
    const loopCards = [...duplicate.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(([card]) => card);
    assert.equal(cards.length, columns[laneIndex].length);
    assert.deepEqual(loopCards, cards);
    for (const [index, { slug, name, color, message }] of columns[laneIndex].entries()) {
      assert.ok(cards[index].includes(`/teams/hero/${slug}.webp`));
      assert.ok(cards[index].includes(`<span>${name}</span>`));
      assert.ok(cards[index].includes(`--team-accent:${color}`));
      assert.ok(cards[index].includes(`<p>${message}</p>`));
    }
  }
  assert.match(html, /class="community-tv"/);
  assert.match(html, /class="community-tv-stand" aria-hidden="true"/);
  assert.doesNotMatch(html, /community-tv-channel|community-tv-controls|community-tv-buttons|<button|undefined/);
});
