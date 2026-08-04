import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

test("build includes the playable game and worker entrypoint", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /MSN球星大冒险/);
  await stat(new URL("../dist/client/game.js", import.meta.url));
  await stat(new URL("../dist/server/index.js", import.meta.url));
});
