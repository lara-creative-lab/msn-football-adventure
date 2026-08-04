import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

test("build includes the playable game and worker entrypoint", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /MSN球星大冒险/);
  assert.match(html, /音乐：世界杯荣耀曲/);
  assert.match(html, /世界杯金靴套装/);
  assert.match(html, /世界杯冠军奖牌/);
  assert.match(html, /内马尔“帅”字队长袖标/);
  assert.match(html, /世界杯闪电护腿/);
  assert.match(html, /世界杯门神手套/);
  assert.doesNotMatch(html, /潮流头巾|反戴潮帽|美国队长|蜘蛛侠|绿巨人/);
  assert.doesNotMatch(html, /musicSelect|Dai Dai|火影|海贼王/);
  await stat(new URL("../dist/client/game.js", import.meta.url));
  await stat(new URL("../dist/client/world-cup-stadium.wav", import.meta.url));
  await stat(new URL("../dist/server/index.js", import.meta.url));
});
