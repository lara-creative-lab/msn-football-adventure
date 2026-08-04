import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

test("build includes the playable game and worker entrypoint", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /MSN球星大冒险/);
  assert.match(html, /音乐：世界杯荣耀曲/);
  assert.match(html, /1990 意大利·罗马斗兽场/);
  assert.match(html, /1994 美国·玫瑰碗/);
  assert.match(html, /1998 法国·巴黎铁塔/);
  assert.match(html, /2002 韩日·横滨港/);
  assert.match(html, /2006 德国·勃兰登堡门/);
  assert.match(html, /2010 南非·开普桌山/);
  assert.match(html, /2014 巴西·里约热内卢/);
  assert.match(html, /2018 俄罗斯·圣瓦西里/);
  assert.match(html, /2022 卡塔尔·多哈海滨/);
  assert.match(html, /2026 北美三国·联合盛典/);
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
