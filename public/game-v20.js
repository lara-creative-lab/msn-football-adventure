(() => {
  "use strict";

  const canvas = document.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");
  const startScreen = document.querySelector("#startScreen");
  const messageScreen = document.querySelector("#messageScreen");
  const messageKicker = document.querySelector("#messageKicker");
  const messageTitle = document.querySelector("#messageTitle");
  const messageText = document.querySelector("#messageText");
  const soundButton = document.querySelector("#soundButton");
  const rewardToast = document.querySelector("#rewardToast");
  const rewardTitle = document.querySelector("#rewardTitle");
  const rewardDescription = document.querySelector("#rewardDescription");
  const shopScreen = document.querySelector("#shopScreen");
  const walletAmount = document.querySelector("#walletAmount");
  const stampCountElement = document.querySelector("#stampCount");
  const cardGrid = document.querySelector("#cardGrid");
  const cardCount = document.querySelector("#cardCount");
  const levelSelect = document.querySelector("#levelSelect");
  const sceneSelect = document.querySelector("#sceneSelect");

  const W = canvas.width;
  const H = canvas.height;
  const FLOOR_Y = 468;
  const GRAVITY = 2100;
  const keys = new Set();

  const LEVELS = [
    { name: "1990 意大利·罗马斗兽场", scene: "italy90", difficulty: "轻松", routes: { main: "罗马地标主线", forest: "罗马历史街区", beach: "罗马城市广场", snow: "罗马球迷庆典" }, width: 3000, gaps: [90, 105, 110], enemies: 4, speed: 65, sky: ["#5fc8ff", "#ffe3a8"], top: "#8bcf63", base: "#b97648", edge: "#5d3929", accent: "#d94a3a" },
    { name: "1994 美国·玫瑰碗", scene: "usa94", difficulty: "简单", routes: { main: "帕萨迪纳地标主线", forest: "帕萨迪纳历史街区", beach: "帕萨迪纳城市广场", snow: "帕萨迪纳球迷庆典" }, width: 3250, gaps: [105, 115, 120, 110], enemies: 5, speed: 72, sky: ["#4dbcf4", "#f9d8a7"], top: "#66c864", base: "#a56a43", edge: "#4f3429", accent: "#e94848" },
    { name: "1998 法国·巴黎铁塔", scene: "france98", difficulty: "简单+", routes: { main: "巴黎地标主线", forest: "巴黎历史街区", beach: "巴黎城市广场", snow: "巴黎球迷庆典" }, width: 3450, gaps: [110, 125, 120, 130], enemies: 6, speed: 78, sky: ["#6e9bd7", "#ffd9b7"], top: "#8bcf68", base: "#b87b58", edge: "#55413b", accent: "#f0c84b" },
    { name: "2002 韩日·横滨港", scene: "koreajapan02", difficulty: "普通", routes: { main: "横滨港地标主线", forest: "首尔历史街区", beach: "横滨城市广场", snow: "首尔球迷庆典" }, width: 3650, gaps: [120, 135, 125, 145, 120], enemies: 7, speed: 84, sky: ["#57c2ee", "#f1d3dc"], top: "#67c6aa", base: "#4e8195", edge: "#234b61", accent: "#ef586c" },
    { name: "2006 德国·勃兰登堡门", scene: "germany06", difficulty: "普通", routes: { main: "柏林地标主线", forest: "柏林历史街区", beach: "柏林城市广场", snow: "柏林球迷庆典" }, width: 3850, gaps: [125, 140, 135, 150, 130], enemies: 8, speed: 90, sky: ["#6baad8", "#dce9f3"], top: "#71c86b", base: "#8d8272", edge: "#3c3a38", accent: "#f3ca3b" },
    { name: "2010 南非·开普桌山", scene: "southafrica10", difficulty: "进阶", routes: { main: "开普敦地标主线", forest: "开普敦历史街区", beach: "开普敦城市广场", snow: "开普敦球迷庆典" }, width: 4050, gaps: [135, 145, 155, 140, 160], enemies: 8, speed: 98, sky: ["#4dc8ee", "#ffd68d"], top: "#76bd5c", base: "#9e6c3e", edge: "#453629", accent: "#f4bd34" },
    { name: "2014 巴西·里约热内卢", scene: "brazil14", difficulty: "进阶+", routes: { main: "里约地标主线", forest: "里约历史街区", beach: "里约城市广场", snow: "里约球迷庆典" }, width: 4250, gaps: [140, 155, 150, 165, 145, 160], enemies: 9, speed: 104, sky: ["#3bc5ef", "#ffe59d"], top: "#65c951", base: "#ad7745", edge: "#4c3927", accent: "#f6d13c" },
    { name: "2018 俄罗斯·圣瓦西里", scene: "russia18", difficulty: "困难", routes: { main: "莫斯科地标主线", forest: "莫斯科历史街区", beach: "莫斯科红场", snow: "莫斯科球迷庆典" }, width: 4450, gaps: [150, 165, 155, 170, 160, 175], enemies: 10, speed: 110, sky: ["#263b77", "#e7b9c9"], top: "#d9edf3", base: "#6f7f91", edge: "#29394e", accent: "#f2ca46" },
    { name: "2022 卡塔尔·多哈海滨", scene: "qatar22", difficulty: "困难+", routes: { main: "多哈地标主线", forest: "多哈历史街区", beach: "多哈海滨广场", snow: "多哈球迷庆典" }, width: 4650, gaps: [155, 170, 165, 180, 170, 185], enemies: 11, speed: 118, sky: ["#412053", "#f39c67"], top: "#e8bf67", base: "#a65f42", edge: "#4b2934", accent: "#f4e0a4" },
    { name: "2026 美加墨·联合盛典", scene: "northamerica26", difficulty: "终极", routes: { main: "墨西哥城·多伦多·旧金山", forest: "墨西哥城历史街区", beach: "多伦多城市广场", snow: "旧金山球迷庆典" }, width: 4900, gaps: [160, 175, 170, 185, 175, 190, 165], enemies: 12, speed: 126, sky: ["#15224f", "#6ca6dc"], top: "#68c85b", base: "#506b75", edge: "#202d3b", accent: "#ffd24f" },
  ];

  function updateSceneOptions(index = Number(levelSelect.value) || 0) {
    const routes = LEVELS[index].routes;
    for (const option of sceneSelect.options) option.textContent = routes[option.value];
  }
  const PLAYER_META = {
    neymar: { name: "内马尔", number: 10, barcaNumber: 11, team: "巴西", numberColor: "#14703b" },
    messi: { name: "梅西", number: 10, barcaNumber: 10, team: "阿根廷", numberColor: "#171d27" },
    ronaldo: { name: "C罗", number: 7, team: "葡萄牙", numberColor: "#f2c64b" },
    haaland: { name: "哈兰德", number: 9, team: "曼城", numberColor: "#173c73" },
    mbappe: { name: "姆巴佩", number: 10, team: "法国", numberColor: "#ffffff" },
    dembele: { name: "登贝莱", number: 11, team: "巴塞罗那", numberColor: "#f2c64b" },
    vinicius: { name: "维尼修斯", number: 7, team: "皇家马德里", numberColor: "#18254a" },
    bellingham: { name: "贝林厄姆", number: 5, team: "皇家马德里", numberColor: "#18254a" },
    kane: { name: "哈里·凯恩", number: 9, team: "英格兰", numberColor: "#18254a" },
    suarez: { name: "苏亚雷斯", number: 9, barcaNumber: 9, team: "乌拉圭", numberColor: "#171d27" },
  };
  const FOOTBALL_TAUNTS = {
    ronaldo: { label: "SIU！", detail: "跃起转身", style: "siu", duration: 1.18, color: "#b51d2c" },
    haaland: { label: "禅意模式", detail: "盘腿冥想", style: "meditate", duration: 1.28, color: "#62c5e7" },
    mbappe: { label: "冷静抱臂", detail: "巨星姿态", style: "arms", duration: 1.12, color: "#243c94" },
    dembele: { label: "滑跪指天", detail: "双手庆祝", style: "point", duration: 1.18, color: "#c92f4f" },
    vinicius: { label: "桑巴舞步", detail: "暗影彩蛋", style: "dance", duration: 1.24, color: "#e4ad21" },
    bellingham: { label: "伯纳乌展翼", detail: "张开双臂", style: "spread", duration: 1.2, color: "#b88a28" },
    kane: { label: "队长滑跪", detail: "握拳致意", style: "slide", duration: 1.16, color: "#273b70" },
  };
  const CHARACTER_IMAGES = {};
  for (const id of Object.keys(PLAYER_META)) {
    const image = new Image();
    image.src = `./assets/characters/${id}.png`;
    CHARACTER_IMAGES[id] = image;
  }
  const BARCA_CHARACTER_IMAGES = {};
  for (const id of ["neymar", "messi", "suarez"]) {
    const image = new Image();
    image.src = `./assets/characters/${id}-barca.png`;
    BARCA_CHARACTER_IMAGES[id] = image;
  }
  const STAR_CARDS = [
    { id: "neymar", milestone: 200, cities: 1, cost: 200, rating: 91, rarity: "ICON", a: "#f5ce2e", b: "#087b43" },
    { id: "messi", milestone: 400, cities: 2, cost: 400, rating: 94, rarity: "GOAT", a: "#72c9f1", b: "#e8f5ff" },
    { id: "ronaldo", milestone: 600, cities: 3, cost: 600, rating: 94, rarity: "GOAT", a: "#b51d2c", b: "#176b45" },
    { id: "mbappe", milestone: 800, cities: 4, cost: 800, rating: 92, rarity: "ELITE", a: "#243c94", b: "#e24a45" },
    { id: "haaland", milestone: 1000, cities: 5, cost: 1000, rating: 92, rarity: "ELITE", a: "#75d4ee", b: "#152a58" },
    { id: "bellingham", milestone: 1200, cities: 6, cost: 1200, rating: 91, rarity: "GOLD", a: "#f7f2dc", b: "#b88a28" },
    { id: "kane", milestone: 1400, cities: 7, cost: 1400, rating: 91, rarity: "GOLD", a: "#f4f4f4", b: "#273b70" },
    { id: "suarez", milestone: 1600, cities: 8, cost: 1600, rating: 92, rarity: "LEGEND", a: "#66c5ec", b: "#101a2d" },
  ];

  let running = false;
  let finished = false;
  let lastTime = 0;
  let cameraX = 0;
  let coins = 0;
  let totalCoins = 0;
  let msnStage = 1;
  let lives = 3;
  let currentLevel = 0;
  let worldWidth = LEVELS[0].width;
  let goalX = worldWidth - 150;
  let checkpointX = 120;
  let levelWon = false;
  let inBonus = false;
  let layerScene = "main";
  let savedWorld = null;
  let powerUps = [];
  let pipes = [];
  let footballs = [];
  let outfitUnlocked = false;
  let captainUnlocked = false;
  try { outfitUnlocked = localStorage.getItem("hat-adventure-outfit") === "1"; } catch (_) {}
  try { captainUnlocked = localStorage.getItem("hat-adventure-captain") === "1"; } catch (_) {}
  if (captainUnlocked) outfitUnlocked = true;
  let wallet = 0;
  let equippedSkin = "default";
  let ownedSkins = new Set(["default"]);
  try {
    wallet = Number(localStorage.getItem("hat-adventure-wallet")) || 0;
    equippedSkin = localStorage.getItem("hat-adventure-equipped") || "default";
    const savedSkins = JSON.parse(localStorage.getItem("hat-adventure-skins") || "[]");
    ownedSkins = new Set(["default", ...savedSkins]);
  } catch (_) {}
  if (outfitUnlocked) ownedSkins.add("starlight");
  if (captainUnlocked) ownedSkins.add("captain");
  if (!ownedSkins.has(equippedSkin)) equippedSkin = captainUnlocked ? "captain" : (outfitUnlocked ? "starlight" : "default");
  let shopOpen = false;
  let bestScore = 0;
  let ownedCards = new Set();
  try {
    bestScore = Number(localStorage.getItem("hat-adventure-best-score")) || 0;
    ownedCards = new Set(JSON.parse(localStorage.getItem("hat-adventure-cards") || "[]"));
  } catch (_) {}
  let completedLevels = new Set();
  try {
    const savedLevels = JSON.parse(localStorage.getItem("hat-adventure-city-stamps") || "[]");
    completedLevels = new Set(savedLevels.filter((index) => Number.isInteger(index) && index >= 0 && index < LEVELS.length));
  } catch (_) {}
  let soundOn = true;
  let audioCtx = null;
  let musicTimer = null;
  let musicStep = 0;
  let musicAttempt = 0;
  const themeAudio = new Audio();
  themeAudio.loop = true;
  themeAudio.preload = "metadata";
  themeAudio.volume = .38;
  const MUSIC = { file: "./world-cup-stadium.wav", label: "世界杯荣耀曲", fallback: "世界杯现场版" };

  const player = {
    x: 120, y: 380, w: 42, h: 58,
    vx: 0, vy: 0, speed: 335, jump: 845,
    grounded: false, facing: 1, invincible: 0, powerShot: false, shotCooldown: 0,
    jumpCount: 0, maxJumps: 2, growthLevel: 0, heroForm: "neymar",
  };

  let platforms = [];
  let coinItems = [];
  let enemies = [];

  function makeTreasure(x, y, seed = 0) {
    const roll = seed % 13;
    const type = roll === 0 ? "scarf" : (roll === 3 ? "lightning" : (roll % 5 === 0 ? "star" : (roll % 4 === 0 ? "gem" : "coin")));
    const values = { coin: 1, gem: 3, star: 5, lightning: 7, scarf: 10 };
    return { x, y, r: type === "star" || type === "scarf" ? 16 : 14, type, value: values[type], collected: false, phase: seed * .7 };
  }

  function buildLevel(index) {
    const level = LEVELS[index];
    worldWidth = level.width;
    goalX = worldWidth - 150;
    platforms = [];
    coinItems = [];
    enemies = [];
    powerUps = [];
    pipes = [];
    footballs = [];

    const gapTotal = level.gaps.reduce((sum, gap) => sum + gap, 0);
    const span = (worldWidth - gapTotal) / (level.gaps.length + 1);
    let cursor = 0;
    const ground = [];
    for (let i = 0; i <= level.gaps.length; i += 1) {
      const end = i === level.gaps.length ? worldWidth : cursor + span;
      const segment = { x: cursor, y: FLOOR_Y, w: end - cursor, h: 72, ground: true };
      platforms.push(segment); ground.push(segment);
      if (i < level.gaps.length) cursor = end + level.gaps[i];
    }

    const heights = [360, 302, 382, 325, 270, 348];
    let platformIndex = 0;
    for (let x = 300; x < goalX - 180; x += 270 + ((platformIndex + index) % 3) * 28) {
      const y = heights[(platformIndex + index) % heights.length] - Math.min(index * 2, 18);
      const w = 130 + ((platformIndex * 23 + index * 11) % 65);
      platforms.push({ x, y, w, h: 28, ground: false });
      const treasureCount = 2 + (platformIndex + index) % 3;
      for (let c = 0; c < treasureCount; c += 1) {
        coinItems.push(makeTreasure(x + 28 + c * Math.max(28, (w - 56) / Math.max(1, treasureCount - 1)), y - 48, platformIndex * 4 + c + index));
      }
      if (platformIndex === 2 || (index >= 5 && platformIndex === 8)) {
        powerUps.push({ x: x + w / 2 - 15, y: y - 34, w: 30, h: 30, type: "matchball", collected: false });
      }
      platformIndex += 1;
    }

    for (let x = 720, prizeIndex = 0; x < goalX - 260; x += 820, prizeIndex += 1) {
      const prize = makeTreasure(x, 145 + (prizeIndex % 2) * 42, prizeIndex * 13);
      prize.type = "scarf"; prize.value = 25; prize.r = 19;
      coinItems.push(prize);
    }

    ground.slice(0, -1).forEach((segment, i) => {
      coinItems.push(makeTreasure(segment.x + segment.w - 55, FLOOR_Y - 64, i + index * 3));
      if (i % 2 === 0 && segment.w > 330) {
        const realms = ["forest", "beach", "snow"];
        pipes.push({ x: segment.x + segment.w * .58, y: FLOOR_Y - 62, w: 58, h: 62, target: realms[(i + index) % realms.length], glow: true });
      }
    });

    const enemyGround = ground.filter((segment, groundIndex) => groundIndex > 0 && segment.w > 250);
    for (let i = 0; i < level.enemies; i += 1) {
      const segment = enemyGround[i % enemyGround.length];
      const laneStart = segment.x + 95;
      const laneEnd = segment.x + segment.w - 45;
      const offset = ((i * 137) % Math.max(90, laneEnd - laneStart - 60));
      const footballers = ["ronaldo", "haaland", "mbappe", "dembele", "vinicius", "bellingham", "kane"];
      const type = footballers[(i + index) % footballers.length];
      enemies.push({
        x: Math.min(laneEnd - 45, laneStart + offset), y: 428, w: 45, h: 40,
        minX: laneStart, maxX: laneEnd, vx: (i % 2 ? 1 : -1) * level.speed,
        alive: true, type, hp: 1, flash: 0, shotCooldown: .9 + (i % 4) * .42,
        tauntTimer: 0, tauntDuration: 0, tauntStyle: "", tauntRewarded: false, tauntFacing: 1,
      });
    }
  }

  function journeyScore(score = totalCoins + coins) {
    return Math.max(bestScore, score);
  }

  function calculateMsnStage(score = totalCoins + coins) {
    const stamps = completedLevels.size;
    const progressScore = journeyScore(score);
    if (progressScore >= 1000 && stamps >= 6) return 3;
    if (progressScore >= 500 && stamps >= 3) return 2;
    return 1;
  }

  function trophyPieceCount() {
    return Math.min(3, Math.max(0, completedLevels.size - 6));
  }

  function hasWorldCupTrophy() {
    return msnStage === 3 && completedLevels.size >= LEVELS.length;
  }

  function saveJourneyProgress() {
    try { localStorage.setItem("hat-adventure-city-stamps", JSON.stringify([...completedLevels].sort((a, b) => a - b))); } catch (_) {}
  }

  function updateLevelOptionProgress() {
    for (const option of levelSelect.options) {
      if (!option.dataset.baseLabel) option.dataset.baseLabel = option.textContent.replace(/^✓\s*/, "");
      option.textContent = `${completedLevels.has(Number(option.value)) ? "✓ " : ""}${option.dataset.baseLabel}`;
    }
  }

  function collectCityStamp(levelIndex) {
    if (completedLevels.has(levelIndex)) return false;
    completedLevels.add(levelIndex);
    saveJourneyProgress();
    updateLevelOptionProgress();
    return true;
  }

  function resetLevel() {
    player.x = 120; player.y = 380; player.vx = 0; player.vy = 0;
    const equippedScale = 1;
    player.w = Math.round(52 * equippedScale); player.h = Math.round(52 * equippedScale); player.grounded = false; player.invincible = 0; player.facing = 1; player.powerShot = false; player.shotCooldown = 0; player.jumpCount = 0; player.growthLevel = 0; player.heroForm = "neymar";
    cameraX = 0; coins = 0; lives = 3; finished = false; levelWon = false; checkpointX = 120; inBonus = false; layerScene = "main"; savedWorld = null;
    msnStage = calculateMsnStage();
    rewardToast.classList.add("hidden");
    buildLevel(currentLevel);
  }

  function startGame() {
    currentLevel = Number(levelSelect.value) || 0;
    totalCoins = 0;
    resetLevel();
    const requestedScene = sceneSelect.value;
    if (requestedScene !== "main") enterLayer(requestedScene, { x: 40 });
    running = true;
    startScreen.classList.add("hidden");
    messageScreen.classList.add("hidden");
    ensureAudio();
    startMusic();
    beep(330, .06, "square", .03);
  }

  function continueGame() {
    if (levelWon && currentLevel < LEVELS.length - 1) {
      totalCoins += coins;
      currentLevel += 1;
    }
    resetLevel();
    running = true;
    messageScreen.classList.add("hidden");
    startMusic();
  }

  function ensureAudio() {
    if (!soundOn) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  }

  function beep(freq, duration, type = "square", volume = .04, delay = 0) {
    if (!soundOn) return;
    ensureAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const at = audioCtx.currentTime + delay;
    osc.type = type; osc.frequency.setValueAtTime(freq, at);
    gain.gain.setValueAtTime(volume, at);
    gain.gain.exponentialRampToValueAtTime(.001, at + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(at); osc.stop(at + duration);
  }

  // The game has one original World Cup-style track. If it cannot load, a
  // lightweight stadium loop keeps the match atmosphere going.
  function startMusic() {
    stopMusic();
    if (!soundOn) return;
    const attempt = musicAttempt;
    themeAudio.src = MUSIC.file;
    themeAudio.currentTime = 0;
    const playback = themeAudio.play();
    if (playback && typeof playback.then === "function") {
      playback.then(() => {
        if (attempt === musicAttempt && soundOn) soundButton.textContent = `音乐：${MUSIC.label}`;
      }).catch(() => {
        if (attempt === musicAttempt && soundOn) startFallbackMusic();
      });
      return;
    }
    startFallbackMusic();
  }

  function startFallbackMusic() {
    soundButton.textContent = `音乐：${MUSIC.fallback}`;
    musicStep = 0;
    const arrangement = { lead: [392, 0, 523, 0, 587, 523, 440, 0, 392, 440, 523, 0, 659, 587, 523, 0], bass: [98, 98, 131, 131, 110, 110, 147, 147], tempo: 190, wave: "triangle" };
    const tick = () => {
      if (!soundOn || !running || finished) return;
      const note = arrangement.lead[musicStep % arrangement.lead.length];
      if (note) beep(note, .16, arrangement.wave, .016);
      if (musicStep % 2 === 0) beep(arrangement.bass[(musicStep / 2) % arrangement.bass.length], .18, "sine", .02);
      beep(musicStep % 4 === 0 ? 90 : 160, .035, "square", .011);
      if (musicStep % 8 === 6) {
        beep(784, .08, "triangle", .011);
        beep(988, .08, "triangle", .009, .08);
      }
      musicStep += 1;
    };
    tick();
    musicTimer = window.setInterval(tick, arrangement.tempo);
  }

  function stopMusic() {
    musicAttempt += 1;
    if (musicTimer !== null) window.clearInterval(musicTimer);
    musicTimer = null;
    themeAudio.pause();
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function update(dt) {
    if (!running || finished || shopOpen) return;
    if (player.shotCooldown > 0) player.shotCooldown -= dt;

    const left = keys.has("ArrowLeft") || keys.has("KeyA");
    const right = keys.has("ArrowRight") || keys.has("KeyD");
    const target = (right ? 1 : 0) - (left ? 1 : 0);
    player.vx += (target * player.speed - player.vx) * Math.min(1, dt * (player.grounded ? 12 : 5));
    if (target) player.facing = target;

    const oldY = player.y;
    player.vy += GRAVITY * dt;
    player.x += player.vx * dt;
    player.x = Math.max(0, Math.min(worldWidth - player.w, player.x));
    player.y += player.vy * dt;
    player.grounded = false;

    for (const p of platforms) {
      if (!rectsOverlap(player, p)) continue;
      const oldBottom = oldY + player.h;
      if (player.vy >= 0 && oldBottom <= p.y + 7) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.grounded = true;
        player.jumpCount = 0;
        if (p.ground && player.x > checkpointX) checkpointX = Math.min(player.x, p.x + p.w - 80);
      } else if (player.vy < 0 && oldY >= p.y + p.h - 7) {
        player.y = p.y + p.h;
        player.vy = 20;
      } else if (player.vx > 0) {
        player.x = p.x - player.w;
        player.vx = 0;
      } else if (player.vx < 0) {
        player.x = p.x + p.w;
        player.vx = 0;
      }
    }

    if (player.y > H + 120) hurt(true);
    if (player.invincible > 0) player.invincible -= dt;

    for (const coin of coinItems) {
      if (coin.collected) continue;
      const dx = player.x + player.w / 2 - coin.x;
      const dy = player.y + player.h / 2 - coin.y;
      if (dx * dx + dy * dy < 38 * 38) {
        coin.collected = true;
        if (coin.type === "scarf") {
          coins += coin.value;
          addWallet(coin.value);
          showScarfReward(coin.value);
        } else {
          coins += coin.value;
          addWallet(coin.value);
        }
        checkScoreRewards();
        beep(660, .07, "square", .035); beep(990, .09, "square", .025, .05);
      }
    }

    for (const item of powerUps) {
      if (item.collected || !rectsOverlap(player, item)) continue;
      item.collected = true;
      player.powerShot = true;
      rewardTitle.textContent = "⚽ 世界杯能量球！";
      rewardDescription.textContent = "获得强力比赛用球：足球变大、威力提升";
      rewardToast.classList.remove("hidden");
      window.setTimeout(() => rewardToast.classList.add("hidden"), 2200);
      beep(392, .1, "square", .035); beep(523, .1, "square", .035, .08); beep(784, .18, "square", .03, .16);
    }

    for (const ball of footballs) {
      ball.x += ball.vx * dt;
      ball.vy += 520 * dt;
      ball.y += ball.vy * dt;
      ball.rotation += ball.vx * dt * .035;
      ball.life -= dt;
      if (ball.y + ball.h >= FLOOR_Y) {
        ball.y = FLOOR_Y - ball.h;
        ball.vy = -Math.abs(ball.vy) * .52;
        ball.bounces += 1;
        if (ball.bounces > 2) ball.dead = true;
      }
      if (ball.owner === "player") {
        for (const enemy of enemies) {
          if (!enemy.alive || enemy.tauntTimer > 0 || ball.dead || !rectsOverlap(ball, enemy)) continue;
          ball.dead = true;
          hitEnemy(enemy, ball.damage || 1);
        }
      } else if (!ball.dead && rectsOverlap(ball, player)) {
        ball.dead = true;
        hurt(false);
      }
    }
    footballs = footballs.filter((ball) => !ball.dead && ball.life > 0 && ball.x > -50 && ball.x < worldWidth + 50);

    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      if (enemy.flash > 0) enemy.flash -= dt;
      if (enemy.tauntTimer > 0) {
        enemy.tauntTimer -= dt;
        if (enemy.tauntTimer <= 0) completeEnemyTaunt(enemy);
        continue;
      }
      enemy.x += enemy.vx * dt;
      if (enemy.x < enemy.minX || enemy.x + enemy.w > enemy.maxX) {
        enemy.vx *= -1;
        enemy.x = Math.max(enemy.minX, Math.min(enemy.maxX - enemy.w, enemy.x));
      }
      enemy.shotCooldown -= dt;
      const playerDistance = player.x + player.w / 2 - (enemy.x + enemy.w / 2);
      if (enemy.shotCooldown <= 0 && Math.abs(playerDistance) < 900 && Math.abs(player.y - enemy.y) < 150) {
        const direction = playerDistance >= 0 ? 1 : -1;
        footballs.push({ owner: "enemy", x: enemy.x + enemy.w / 2 - 8, y: enemy.y + 15, w: 16, h: 16, vx: direction * (285 + currentLevel * 9), vy: -175, rotation: 0, bounces: 0, life: 3.2, damage: 1, dead: false });
        enemy.shotCooldown = Math.max(1.05, 2.55 - currentLevel * .08) + ((enemy.x | 0) % 5) * .08;
        beep(165, .05, "triangle", .018);
      }
      if (rectsOverlap(player, enemy)) {
        const wasAbove = oldY + player.h <= enemy.y + 9 && player.vy > 0;
        if (wasAbove) {
          hitEnemy(enemy, 1); player.vy = -480;
          beep(180, .06, "square", .05); beep(260, .1, "square", .035, .04);
        } else if (player.invincible <= 0) hurt(false);
      }
    }

    if (!inBonus && player.x > goalX - 70) win();
    cameraX += (Math.max(0, Math.min(worldWidth - W, player.x - W * .36)) - cameraX) * Math.min(1, dt * 5);
  }

  function hitEnemy(enemy, damage) {
    if (!enemy.alive || enemy.tauntTimer > 0) return;
    enemy.hp -= damage;
    enemy.flash = .16;
    if (enemy.hp <= 0) {
      const taunt = FOOTBALL_TAUNTS[enemy.type] || { style: "slide", duration: 1.1 };
      enemy.hp = 0;
      enemy.tauntStyle = taunt.style;
      enemy.tauntDuration = taunt.duration;
      enemy.tauntTimer = taunt.duration;
      enemy.tauntFacing = enemy.vx >= 0 ? 1 : -1;
      enemy.vx = 0;
      enemy.shotCooldown = 999;
      playTauntSound(taunt.style);
    } else {
      enemy.vx *= -1.28;
      beep(120, .09, "square", .035);
    }
  }

  function completeEnemyTaunt(enemy) {
    if (enemy.tauntRewarded) return;
    enemy.tauntRewarded = true;
    enemy.tauntTimer = 0;
    enemy.alive = false;
    applyFootballerReward(enemy.type);
    beep(210, .07, "square", .04); beep(320, .1, "square", .03, .05);
  }

  function playTauntSound(style) {
    const sounds = {
      siu: [[330, .07, "square"], [494, .07, "square"], [740, .15, "triangle"]],
      meditate: [[220, .16, "sine"], [330, .18, "sine"], [440, .2, "sine"]],
      arms: [[262, .08, "triangle"], [392, .08, "triangle"], [523, .14, "triangle"]],
      point: [[294, .07, "square"], [440, .08, "triangle"], [659, .14, "triangle"]],
      dance: [[330, .06, "triangle"], [392, .06, "triangle"], [494, .06, "triangle"], [659, .13, "triangle"]],
      spread: [[262, .08, "triangle"], [392, .08, "triangle"], [587, .16, "triangle"]],
      slide: [[196, .07, "square"], [294, .08, "square"], [440, .15, "triangle"]],
    };
    (sounds[style] || sounds.slide).forEach(([frequency, duration, wave], index) => beep(frequency, duration, wave, .026, index * .075));
  }

  function applyFootballerReward(type) {
    const names = Object.fromEntries(Object.entries(PLAYER_META).map(([id, meta]) => [id, meta.name]));
    coins += 10; addWallet(10); checkScoreRewards();
    if (type === "messi") {
      captainUnlocked = true; outfitUnlocked = true;
      ownedSkins.add("captain"); ownedSkins.add("starlight"); equippedSkin = "captain"; player.heroForm = "neymar";
      try { localStorage.setItem("hat-adventure-captain", "1"); localStorage.setItem("hat-adventure-outfit", "1"); } catch (_) {}
      saveCosmetics(); updateShopUI();
      showFootballReward("🥇 梅西奖励！", "世界杯冠军奖牌与金靴套装已加入橱窗并自动装备");
    } else if (type === "ronaldo") {
      ownedSkins.add("ninja"); equippedSkin = "ninja"; player.heroForm = "neymar";
      saveCosmetics(); updateShopUI();
      showFootballReward("🏷️ C罗奖励！", "内马尔“帅”字队长袖标已加入橱窗并自动装备");
    } else if (type === "dembele") {
      growPlayer();
    } else if (type === "vinicius") {
      player.heroForm = "black";
      showFootballReward("⚫ 维尼修斯奖励！", "内马尔切换为暗影公仔形态");
    } else {
      showFootballReward(`⚽ 击败${names[type]}！`, "获得 10 点积分与宝藏");
    }
  }

  function showFootballReward(title, description) {
    rewardTitle.textContent = title; rewardDescription.textContent = description;
    rewardToast.classList.remove("hidden");
    window.setTimeout(() => rewardToast.classList.add("hidden"), 2800);
  }

  function growPlayer() {
    if (player.growthLevel >= 3) {
      coins += 20;
      addWallet(20);
      checkScoreRewards();
      return;
    }
    const bottom = player.y + player.h;
    player.growthLevel += 1;
    const scale = 1 + player.growthLevel * .25;
    player.w = Math.round(52 * scale);
    player.h = Math.round(52 * scale);
    player.y = bottom - player.h;
    player.invincible = Math.max(player.invincible, 1.2);
    rewardTitle.textContent = "⬆️ 登贝莱奖励！";
    rewardDescription.textContent = player.growthLevel === 3 ? "内马尔进入最大公仔形态" : "内马尔公仔变大了";
    rewardToast.classList.remove("hidden");
    window.setTimeout(() => rewardToast.classList.add("hidden"), 2600);
    beep(262, .1, "triangle", .04); beep(330, .1, "triangle", .04, .08); beep(392, .1, "triangle", .04, .16); beep(523, .22, "triangle", .035, .24);
  }

  function transformSpider() {
    const bottom = player.y + player.h;
    player.heroForm = "spider"; player.growthLevel = 0;
    player.w = 48; player.h = 66; player.y = bottom - player.h;
    player.invincible = Math.max(player.invincible, 1.5);
    rewardTitle.textContent = "🕷 蜘蛛侠变身！";
    rewardDescription.textContent = "击败哆啦A梦，获得红蓝蜘蛛战衣";
    rewardToast.classList.remove("hidden");
    window.setTimeout(() => rewardToast.classList.add("hidden"), 3200);
    beep(330, .08, "square", .04); beep(494, .08, "triangle", .035, .07); beep(659, .14, "triangle", .03, .14);
  }

  function checkScoreRewards() {
    const score = totalCoins + coins;
    if (score > bestScore) {
      bestScore = score;
      try { localStorage.setItem("hat-adventure-best-score", String(bestScore)); } catch (_) {}
    }
    const newlyUnlocked = STAR_CARDS.filter((card) => bestScore >= card.milestone && completedLevels.size >= card.cities && !ownedCards.has(card.id));
    newlyUnlocked.forEach((card) => ownedCards.add(card.id));
    if (newlyUnlocked.length) {
      saveCards();
      rewardTitle.textContent = "⚽ 球星卡解锁！";
      rewardDescription.textContent = `获得：${newlyUnlocked.map((card) => PLAYER_META[card.id].name).join("、")}`;
      rewardToast.classList.remove("hidden");
      window.setTimeout(() => rewardToast.classList.add("hidden"), 2800);
    }
    updateMsnStage(score);
  }

  function updateMsnStage(score) {
    const nextStage = calculateMsnStage(score);
    if (nextStage <= msnStage) return;
    msnStage = nextStage;
    if (msnStage === 2) {
      rewardTitle.textContent = "🤝 梅西加入主角队！";
      rewardDescription.textContent = "500分 + 3枚城市印章达成：MSN 2/3";
    } else {
      rewardTitle.textContent = "🔵🔴 MSN组合完成！";
      rewardDescription.textContent = "1000分 + 6枚城市印章达成：换上巴萨战袍，继续寻找大力神杯碎片";
    }
    rewardToast.classList.remove("hidden");
    window.setTimeout(() => rewardToast.classList.add("hidden"), 4200);
    beep(523, .11, "triangle", .045); beep(659, .11, "triangle", .04, .1); beep(784, .14, "triangle", .04, .2); beep(1047, .32, "triangle", .035, .32);
  }

  function saveCards() {
    try { localStorage.setItem("hat-adventure-cards", JSON.stringify([...ownedCards])); } catch (_) {}
  }

  function addWallet(amount) {
    wallet += Math.max(0, Math.round(amount));
    try { localStorage.setItem("hat-adventure-wallet", String(wallet)); } catch (_) {}
    walletAmount.textContent = String(wallet);
  }

  function showScarfReward(amount) {
    rewardTitle.textContent = "📣 世界杯助威围巾！";
    rewardDescription.textContent = `球迷助威奖励：获得 ${amount} 点积分`;
    rewardToast.classList.remove("hidden");
    window.setTimeout(() => rewardToast.classList.add("hidden"), 1800);
    beep(523, .07, "triangle", .025); beep(659, .07, "triangle", .025, .05); beep(784, .07, "triangle", .025, .1); beep(1047, .16, "triangle", .02, .15);
  }

  function shoot() {
    if (!running || finished || player.shotCooldown > 0) return;
    const size = player.powerShot ? 22 : 17;
    footballs.push({ owner: "player", x: player.x + (player.facing > 0 ? player.w - 4 : -size), y: player.y + player.h * .48, w: size, h: size, vx: player.facing * (player.powerShot ? 650 : 590), vy: player.powerShot ? -225 : -190, rotation: 0, bounces: 0, damage: player.powerShot ? 2 : 1, life: 2.8, dead: false });
    player.shotCooldown = player.powerShot ? .22 : .34;
    beep(520, .05, "square", .035); beep(760, .06, "triangle", .02, .03);
  }

  function tryPipe() {
    if (!running || finished || !player.grounded) return;
    const center = player.x + player.w / 2;
    const pipe = pipes.find((candidate) => Math.abs(center - (candidate.x + candidate.w / 2)) < 48);
    if (!pipe) return;
    if (pipe.target === "main") leaveBonus();
    else enterLayer(pipe.target, pipe);
  }

  function enterLayer(target, sourcePipe) {
    if (!inBonus) {
      savedWorld = { platforms, coinItems, enemies, powerUps, pipes, footballs, worldWidth, goalX, checkpointX, returnX: sourcePipe.x + 115 };
    }
    inBonus = true; layerScene = target;
    worldWidth = 2300; goalX = 99999; checkpointX = 100; cameraX = 0; footballs = [];
    platforms = [
      { x: 0, y: FLOOR_Y, w: 650, h: 72, ground: true },
      { x: 760, y: FLOOR_Y, w: 650, h: 72, ground: true },
      { x: 1530, y: FLOOR_Y, w: 770, h: 72, ground: true },
      { x: 275, y: 355, w: 175, h: 28 }, { x: 545, y: 285, w: 165, h: 28 },
      { x: 885, y: 365, w: 180, h: 28 }, { x: 1175, y: 285, w: 175, h: 28 },
      { x: 1585, y: 350, w: 190, h: 28 }, { x: 1880, y: 270, w: 180, h: 28 },
    ];
    coinItems = [];
    for (let i = 0; i < 42; i += 1) coinItems.push(makeTreasure(180 + i * 46, 220 + Math.sin(i * .72) * 105, i + currentLevel * 7 + target.length));
    [540, 1120, 1840].forEach((x, i) => {
      const prize = makeTreasure(x, 115 + i % 2 * 35, i * 13);
      prize.type = "scarf"; prize.value = 25; prize.r = 19; coinItems.push(prize);
    });
    const realmTypes = target === "snow" ? ["haaland", "kane", "ronaldo", "bellingham", "mbappe"] : (target === "beach" ? ["vinicius", "ronaldo", "dembele", "kane", "mbappe"] : ["ronaldo", "bellingham", "haaland", "dembele", "vinicius"]);
    enemies = realmTypes.map((type, i) => ({
      x: 820 + i * 260, y: 428, w: 45, h: 40, minX: 780 + i * 250, maxX: 1050 + i * 250,
      vx: (i % 2 ? -1 : 1) * (82 + currentLevel * 4), alive: true, type,
      hp: 1, flash: 0, shotCooldown: 1 + (i % 3) * .5,
      tauntTimer: 0, tauntDuration: 0, tauntStyle: "", tauntRewarded: false, tauntFacing: 1,
    }));
    powerUps = [{ x: 605, y: 250, w: 30, h: 30, type: "matchball", collected: false }, { x: 1935, y: 235, w: 30, h: 30, type: "matchball", collected: false }];
    const next = target === "forest" ? "beach" : (target === "beach" ? "snow" : "forest");
    pipes = [
      { x: 70, y: FLOOR_Y - 62, w: 58, h: 62, target: "main", glow: true },
      { x: 2135, y: FLOOR_Y - 62, w: 58, h: 62, target: next, glow: true },
    ];
    player.x = 155; player.y = 360; player.vx = 0; player.vy = 0; player.jumpCount = 0;
    beep(260, .08, "sine", .035); beep(180, .16, "sine", .03, .07);
  }

  function leaveBonus() {
    if (!savedWorld) return;
    ({ platforms, coinItems, enemies, powerUps, pipes, footballs, worldWidth, goalX, checkpointX } = savedWorld);
    const returnX = savedWorld.returnX;
    savedWorld = null; inBonus = false; layerScene = "main"; cameraX = Math.max(0, returnX - W * .35);
    player.x = returnX; player.y = 350; player.vx = 0; player.vy = 0; player.jumpCount = 0;
    beep(180, .08, "sine", .03); beep(290, .14, "sine", .035, .07);
  }

  function jump() {
    if (!running || finished || player.jumpCount >= player.maxJumps) return;
    const secondJump = player.jumpCount === 1;
    player.vy = -(secondJump ? player.jump * .9 : player.jump);
    player.grounded = false;
    player.jumpCount += 1;
    if (secondJump) {
      beep(420, .08, "triangle", .04); beep(660, .12, "triangle", .03, .05);
    } else {
      beep(280, .09, "square", .035); beep(380, .1, "square", .025, .05);
    }
  }

  function unlockOutfit() {
    outfitUnlocked = true;
    ownedSkins.add("starlight"); equippedSkin = "starlight"; saveCosmetics();
    try { localStorage.setItem("hat-adventure-outfit", "1"); } catch (_) {}
    rewardTitle.textContent = "500 分特殊奖励！";
    rewardDescription.textContent = "内马尔获得“世界杯金靴套装”";
    rewardToast.classList.remove("hidden");
    window.setTimeout(() => rewardToast.classList.add("hidden"), 4200);
    beep(523, .12, "triangle", .045); beep(659, .12, "triangle", .04, .12); beep(784, .12, "triangle", .04, .24); beep(1047, .3, "triangle", .035, .36);
  }

  function unlockCaptain() {
    captainUnlocked = true;
    outfitUnlocked = true;
    ownedSkins.add("captain"); ownedSkins.add("starlight"); equippedSkin = "captain"; saveCosmetics();
    try { localStorage.setItem("hat-adventure-captain", "1"); localStorage.setItem("hat-adventure-outfit", "1"); } catch (_) {}
    rewardTitle.textContent = "1000 分冠军奖励！";
    rewardDescription.textContent = "内马尔戴上世界杯冠军奖牌";
    rewardToast.classList.remove("hidden");
    window.setTimeout(() => rewardToast.classList.add("hidden"), 5200);
    beep(392, .14, "triangle", .05); beep(523, .14, "triangle", .045, .12); beep(659, .14, "triangle", .045, .24); beep(784, .16, "triangle", .04, .36); beep(1047, .38, "triangle", .04, .5);
  }

  function saveCosmetics() {
    try {
      localStorage.setItem("hat-adventure-wallet", String(wallet));
      localStorage.setItem("hat-adventure-skins", JSON.stringify([...ownedSkins]));
      localStorage.setItem("hat-adventure-equipped", equippedSkin);
    } catch (_) {}
  }

  function equipSkin(skin) {
    equippedSkin = skin; player.heroForm = "neymar"; player.growthLevel = 0;
    const scale = 1;
    const bottom = player.y + player.h; player.w = Math.round(52 * scale); player.h = Math.round(52 * scale); player.y = bottom - player.h;
    saveCosmetics(); updateShopUI();
  }

  function updateShopUI() {
    walletAmount.textContent = String(wallet);
    stampCountElement.textContent = `${completedLevels.size} / ${LEVELS.length}`;
    document.querySelectorAll("[data-skin]").forEach((button) => {
      const skin = button.dataset.skin;
      button.textContent = equippedSkin === skin ? "已装备" : (ownedSkins.has(skin) ? "装备" : `购买 ${button.dataset.cost}`);
      button.disabled = equippedSkin === skin;
    });
    renderCardGrid();
  }

  function renderCardGrid() {
    const validCardCount = STAR_CARDS.filter((card) => ownedCards.has(card.id)).length;
    cardCount.textContent = `${validCardCount} / ${STAR_CARDS.length}`;
    cardGrid.innerHTML = STAR_CARDS.map((card) => {
      const owned = ownedCards.has(card.id);
      const meta = PLAYER_META[card.id];
      return `<article class="star-card ${owned ? "" : "locked"}" style="--card-a:${card.a};--card-b:${card.b}">
        <span class="rating">${card.rating}</span><span class="rarity">${card.rarity}</span>
        <img class="card-player" src="./assets/characters/${card.id}.png" alt="${meta.name} ${meta.number}号公仔">
        <span class="card-number">#${meta.number}</span><strong>${owned ? meta.name : "神秘球星"}</strong>
        <small>${owned ? `${meta.team} · 典藏编号 ${String(card.milestone).padStart(4, "0")}` : `${card.milestone}分 + ${card.cities}城解锁`}</small>
        <button type="button" data-card="${card.id}" data-cost="${card.cost}" ${owned ? "disabled" : ""}>${owned ? "已收藏" : `兑换 ${card.cost}`}</button>
      </article>`;
    }).join("");
    cardGrid.querySelectorAll("[data-card]").forEach((button) => {
      button.addEventListener("click", () => redeemCard(button.dataset.card, Number(button.dataset.cost) || 0));
    });
  }

  function redeemCard(cardId, cost) {
    if (ownedCards.has(cardId)) return;
    if (wallet < cost) {
      rewardTitle.textContent = "宝藏不足";
      rewardDescription.textContent = `还需要 ${cost - wallet} 宝藏积分兑换球星卡`;
      rewardToast.classList.remove("hidden");
      window.setTimeout(() => rewardToast.classList.add("hidden"), 1800);
      return;
    }
    wallet -= cost; ownedCards.add(cardId); saveCards(); saveCosmetics(); updateShopUI();
    rewardTitle.textContent = "⚽ 兑换成功！";
    rewardDescription.textContent = `获得 ${PLAYER_META[cardId]?.name || "球星"} 典藏卡`;
    rewardToast.classList.remove("hidden");
    window.setTimeout(() => rewardToast.classList.add("hidden"), 2200);
  }

  function openShop() {
    shopOpen = true; updateShopUI(); shopScreen.classList.remove("hidden");
  }

  function closeShop() {
    shopOpen = false; shopScreen.classList.add("hidden");
  }

  function hurt(fell) {
    if (player.invincible > 0 || finished) return;
    lives -= 1;
    beep(140, .22, "sawtooth", .04);
    if (lives <= 0) {
      finish(false);
      return;
    }
    player.x = fell ? Math.max(80, checkpointX) : Math.max(80, player.x - 150);
    player.y = 300; player.vx = 0; player.vy = -150; player.invincible = 1.7;
  }

  function win() {
    if (finished) return;
    beep(523, .12, "square", .04);
    beep(659, .12, "square", .04, .12);
    beep(784, .24, "square", .04, .24);
    finish(true);
  }

  function finish(won) {
    finished = true;
    levelWon = won;
    stopMusic();
    const stampAdded = won ? collectCityStamp(currentLevel) : false;
    if (stampAdded) checkScoreRewards();
    const finalLevel = currentLevel === LEVELS.length - 1;
    const journeyComplete = completedLevels.size >= LEVELS.length;
    const trophyWon = hasWorldCupTrophy();
    const stampText = `${stampAdded ? "新城市印章" : "城市印章已收藏"} · ${completedLevels.size}/${LEVELS.length}`;
    const rewardText = trophyWon
      ? "十城齐聚，大力神杯组装完成！"
      : (msnStage === 3
        ? `大力神杯碎片 ${trophyPieceCount()}/3；集齐10城后举行捧杯仪式`
        : (msnStage === 2
          ? `下一阶段：累计1000分并收集6城印章，苏亚雷斯加入`
          : `下一阶段：累计500分并收集3城印章，梅西加入`));
    messageKicker.textContent = won ? (trophyWon ? "十城全通！" : "太棒了！") : "别灰心";
    messageTitle.textContent = won ? (trophyWon ? "世界杯时空之旅完成！" : `第 ${currentLevel + 1} 关完成`) : "冒险暂停";
    messageText.textContent = won
      ? (finalLevel
        ? `${LEVELS[currentLevel].name}完成：获得 ${coins} 点宝藏。${stampText}。${rewardText}${journeyComplete ? "" : "，接下来探索尚未收集的城市"}。`
        : `${LEVELS[currentLevel].name}完成：获得 ${coins} 点宝藏。${stampText}。${rewardText}。下一站：${LEVELS[currentLevel + 1].name}。`)
      : `你在${LEVELS[currentLevel].name}收集了 ${coins} 枚星币，再试一次吧！`;
    document.querySelector("#playAgainButton").textContent = won && !finalLevel
      ? "进入下一关"
      : (won ? (trophyWon ? "冠军巡游再来一次" : (journeyComplete ? "继续挑战积分" : "探索缺失城市")) : "重玩本关");
    messageScreen.classList.remove("hidden");
  }

  function drawRoundedRect(x, y, w, h, r, fill, stroke = null, line = 0) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = line; ctx.stroke(); }
  }

  function drawBackground() {
    const level = LEVELS[currentLevel];
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, level.sky[0]); grad.addColorStop(1, level.sky[1]);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

    const cloudBand = (color, yBase, speed, scale = 1) => {
      ctx.fillStyle = color;
      for (let i = -1; i < 6; i += 1) {
        const x = ((i * 260 - cameraX * speed) % 1560) + 30;
        const y = yBase + (i % 3) * 38;
        ctx.beginPath(); ctx.arc(x, y, 26 * scale, Math.PI, 0); ctx.arc(x + 38 * scale, y - 9, 37 * scale, Math.PI, 0); ctx.arc(x + 82 * scale, y, 25 * scale, Math.PI, 0); ctx.fillRect(x, y, 82 * scale, 25 * scale); ctx.fill();
      }
    };
    const stars = (color, count, drift = .05) => {
      ctx.fillStyle = color;
      for (let i = 0; i < count; i += 1) {
        const x = (i * 137 - cameraX * drift) % (W + 100);
        const y = 35 + (i * 83) % 285;
        const r = 1.5 + (i % 3);
        ctx.beginPath(); ctx.moveTo(x, y - r * 2); ctx.lineTo(x + r, y - r / 2); ctx.lineTo(x + r * 2, y); ctx.lineTo(x + r, y + r / 2); ctx.lineTo(x, y + r * 2); ctx.lineTo(x - r, y + r / 2); ctx.lineTo(x - r * 2, y); ctx.lineTo(x - r, y - r / 2); ctx.closePath(); ctx.fill();
      }
    };

    if (level.scene === "italy90") {
      ctx.fillStyle = "#ffe07c"; ctx.beginPath(); ctx.arc(810, 92, 44, 0, Math.PI * 2); ctx.fill();
      cloudBand("rgba(255,255,255,.76)", 88, .12, .86);
      ctx.fillStyle = "#b85d42"; ctx.beginPath(); ctx.ellipse(480, 350, 245, 142, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#d78b5b"; ctx.beginPath(); ctx.ellipse(480, 342, 208, 108, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#723e32"; ctx.beginPath(); ctx.ellipse(480, 340, 164, 70, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#d78b5b"; ctx.fillRect(250, 340, 460, 132);
      ctx.fillStyle = "#56342e"; for (let row = 0; row < 2; row += 1) for (let i = 0; i < 11; i += 1) { const x = 270 + i * 40; const y = 360 + row * 55; ctx.beginPath(); ctx.roundRect(x, y, 24, 40, 12); ctx.fill(); }
      ctx.fillStyle = "#5a9a55"; ctx.beginPath(); ctx.moveTo(0, H); ctx.quadraticCurveTo(220, 410, 430, H); ctx.quadraticCurveTo(700, 405, W, H); ctx.closePath(); ctx.fill();
    } else if (level.scene === "usa94") {
      cloudBand("rgba(255,255,255,.7)", 78, .11, .8);
      ctx.fillStyle = "#7f92a3"; ctx.beginPath(); ctx.moveTo(0, 360); ctx.lineTo(120, 205); ctx.lineTo(235, 360); ctx.lineTo(365, 175); ctx.lineTo(520, 360); ctx.lineTo(690, 220); ctx.lineTo(W, 360); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#efe5d0"; ctx.beginPath(); ctx.ellipse(480, 377, 330, 118, 0, Math.PI, Math.PI * 2); ctx.fill(); ctx.fillRect(150, 370, 660, 98);
      ctx.fillStyle = "#9d2d34"; ctx.fillRect(185, 385, 590, 20); ctx.fillRect(215, 420, 530, 12);
      ctx.fillStyle = "#263c58"; for (let i = 0; i < 12; i += 1) ctx.fillRect(210 + i * 48, 442, 24, 26);
      ctx.fillStyle = "#2e9c5c"; ctx.beginPath(); ctx.ellipse(480, 455, 230, 38, 0, Math.PI, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#704737"; ctx.lineWidth = 9; for (const x of [110, 855]) { ctx.beginPath(); ctx.moveTo(x, 470); ctx.lineTo(x + 15, 315); ctx.stroke(); ctx.fillStyle = "#3f9d55"; for (let a = -2; a <= 2; a += 1) { ctx.beginPath(); ctx.ellipse(x + 15 + a * 8, 305 + Math.abs(a) * 5, 35, 8, a * .45, 0, Math.PI * 2); ctx.fill(); } }
    } else if (level.scene === "france98") {
      ctx.fillStyle = "#ffd88a"; ctx.beginPath(); ctx.arc(790, 92, 42, 0, Math.PI * 2); ctx.fill(); cloudBand("rgba(255,255,255,.62)", 90, .1, .8);
      ctx.fillStyle = "#728a9b"; const tx = 500; ctx.beginPath(); ctx.moveTo(tx, 88); ctx.lineTo(tx - 32, 205); ctx.lineTo(tx - 94, 440); ctx.lineTo(tx - 58, 440); ctx.lineTo(tx - 28, 325); ctx.lineTo(tx + 28, 325); ctx.lineTo(tx + 58, 440); ctx.lineTo(tx + 94, 440); ctx.lineTo(tx + 32, 205); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#d8e2e6"; ctx.lineWidth = 4; for (const y of [190, 250, 320, 380]) { ctx.beginPath(); ctx.moveTo(tx - (y - 105) * .28, y); ctx.lineTo(tx + (y - 105) * .28, y); ctx.stroke(); }
      ctx.fillStyle = "#607b8d"; ctx.fillRect(0, 425, W, 45); ctx.fillStyle = "#86c7dc"; ctx.fillRect(0, 454, W, 30);
      ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; for (let x = 0; x < W; x += 75) { ctx.beginPath(); ctx.moveTo(x, 466); ctx.quadraticCurveTo(x + 18, 458, x + 38, 466); ctx.stroke(); }
    } else if (level.scene === "koreajapan02") {
      cloudBand("rgba(255,255,255,.72)", 70, .1, .78); ctx.fillStyle = "#5cbdd8"; ctx.fillRect(0, 382, W, 90);
      ctx.fillStyle = "#315774"; ctx.fillRect(110, 252, 85, 130); ctx.fillStyle = "#89d7ef"; for (let y = 267; y < 370; y += 18) for (let x = 120; x < 188; x += 18) ctx.fillRect(x, y, 9, 8);
      ctx.fillStyle = "#526b7d"; ctx.beginPath(); ctx.moveTo(300, 382); ctx.lineTo(330, 128); ctx.lineTo(360, 382); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#e8f4f5"; ctx.fillRect(324, 145, 12, 228);
      ctx.strokeStyle = "#e8edf1"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(690, 285, 103, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 2; for (let i = 0; i < 12; i += 1) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(690, 285); ctx.lineTo(690 + Math.cos(a) * 103, 285 + Math.sin(a) * 103); ctx.stroke(); }
      ctx.fillStyle = "#f04e61"; for (let i = 0; i < 12; i += 1) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.arc(690 + Math.cos(a) * 103, 285 + Math.sin(a) * 103, 7, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = "rgba(255,255,255,.62)"; ctx.lineWidth = 3; for (let y = 410; y < 470; y += 22) { ctx.beginPath(); for (let x = 0; x < W; x += 70) { ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 18, y - 6, x + 36, y); } ctx.stroke(); }
    } else if (level.scene === "germany06") {
      cloudBand("rgba(255,255,255,.7)", 80, .1, .8); ctx.fillStyle = "#7f936b"; ctx.fillRect(0, 414, W, 58);
      ctx.fillStyle = "#d6c8a9"; ctx.fillRect(265, 220, 430, 52); ctx.fillRect(285, 272, 390, 175); ctx.fillStyle = "#ece3ca"; for (let i = 0; i < 6; i += 1) ctx.fillRect(310 + i * 59, 270, 22, 177);
      ctx.fillStyle = "#4c5660"; for (let i = 0; i < 5; i += 1) ctx.fillRect(340 + i * 59, 295, 32, 152);
      ctx.fillStyle = "#c4b28e"; ctx.beginPath(); ctx.moveTo(242, 220); ctx.lineTo(480, 160); ctx.lineTo(718, 220); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#56626d"; ctx.fillRect(462, 125, 36, 40); ctx.beginPath(); ctx.arc(480, 115, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#1b1d20"; ctx.fillRect(0, 455, W, 17); ctx.fillStyle = "#d54638"; ctx.fillRect(0, 462, W, 10); ctx.fillStyle = "#e8c642"; ctx.fillRect(0, 470, W, 12);
    } else if (level.scene === "southafrica10") {
      ctx.fillStyle = "#ffe47e"; ctx.beginPath(); ctx.arc(800, 88, 42, 0, Math.PI * 2); ctx.fill(); cloudBand("rgba(255,255,255,.66)", 78, .1, .8);
      ctx.fillStyle = "#627c75"; ctx.beginPath(); ctx.moveTo(40, 405); ctx.lineTo(235, 205); ctx.lineTo(600, 205); ctx.lineTo(760, 405); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#8ca18e"; ctx.fillRect(236, 195, 365, 28); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(248, 188, 340, 14);
      const houses = ["#f05e5e", "#f4c44e", "#45b7c7", "#8b65c3", "#57ad62"]; for (let i = 0; i < 12; i += 1) { const x = 30 + i * 78; ctx.fillStyle = houses[i % houses.length]; ctx.fillRect(x, 390 - (i % 2) * 18, 62, 80); ctx.fillStyle = "#f7efe0"; ctx.beginPath(); ctx.moveTo(x - 5, 390 - (i % 2) * 18); ctx.lineTo(x + 31, 360 - (i % 2) * 18); ctx.lineTo(x + 67, 390 - (i % 2) * 18); ctx.closePath(); ctx.fill(); }
    } else if (level.scene === "brazil14") {
      ctx.fillStyle = "#ffe36e"; ctx.beginPath(); ctx.arc(790, 82, 44, 0, Math.PI * 2); ctx.fill(); cloudBand("rgba(255,255,255,.7)", 75, .1, .8);
      ctx.fillStyle = "#397f5c"; ctx.beginPath(); ctx.moveTo(0, 430); ctx.quadraticCurveTo(170, 210, 330, 430); ctx.quadraticCurveTo(510, 165, 690, 430); ctx.quadraticCurveTo(820, 260, W, 430); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#e8e4d3"; ctx.fillRect(480, 170, 12, 95); ctx.fillRect(449, 186, 74, 10); ctx.beginPath(); ctx.arc(486, 154, 17, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#e8e4d3"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(486, 175); ctx.lineTo(453, 195); ctx.moveTo(486, 175); ctx.lineTo(519, 195); ctx.stroke();
      ctx.fillStyle = "#209dcc"; ctx.fillRect(0, 424, W, 48); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; for (let x = 0; x < W; x += 70) { ctx.beginPath(); ctx.moveTo(x, 446); ctx.quadraticCurveTo(x + 18, 437, x + 38, 446); ctx.stroke(); }
      ctx.fillStyle = "#f4d776"; ctx.fillRect(0, 465, W, 18);
    } else if (level.scene === "russia18") {
      stars("rgba(255,231,173,.9)", 28, .06); ctx.fillStyle = "#f4d07b"; ctx.beginPath(); ctx.arc(810, 88, 38, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#8f3d50"; ctx.fillRect(245, 292, 470, 178); ctx.fillStyle = "#d4bd9d"; for (let i = 0; i < 6; i += 1) ctx.fillRect(270 + i * 77, 320, 48, 150);
      const domeX = [288, 365, 442, 519, 596, 673]; const domeColors = ["#3ca1a4", "#e2b840", "#d94c4f", "#4c9b63", "#5c6ec0", "#e7774d"]; domeX.forEach((x, i) => { ctx.fillStyle = domeColors[i]; ctx.beginPath(); ctx.moveTo(x - 28, 295); ctx.quadraticCurveTo(x - 38, 245, x, 205 - (i % 2) * 25); ctx.quadraticCurveTo(x + 38, 245, x + 28, 295); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#f0ca55"; ctx.fillRect(x - 3, 188 - (i % 2) * 25, 6, 25); });
      ctx.fillStyle = "#e8d6c8"; ctx.fillRect(0, 452, W, 25);
    } else if (level.scene === "qatar22") {
      stars("rgba(255,232,183,.82)", 24, .08); ctx.fillStyle = "#f6d487"; ctx.beginPath(); ctx.arc(805, 84, 42, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#69445a"; ctx.beginPath(); ctx.moveTo(0, 430); for (let x = 0; x <= W + 220; x += 220) ctx.quadraticCurveTo(x + 110, 330, x + 220, 430); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      const towers = [{x:135,w:58,h:170},{x:230,w:76,h:215},{x:350,w:52,h:155},{x:560,w:65,h:235},{x:680,w:80,h:190},{x:800,w:48,h:145}]; towers.forEach((t, i) => { ctx.fillStyle = i % 2 ? "#7cc3cb" : "#b6d9d8"; ctx.beginPath(); ctx.roundRect(t.x, 430 - t.h, t.w, t.h, i % 2 ? 24 : 8); ctx.fill(); ctx.fillStyle = "rgba(255,226,145,.8)"; for (let y = 450 - t.h; y < 414; y += 25) ctx.fillRect(t.x + 12, y, t.w - 24, 6); });
      ctx.fillStyle = "#3e8ba5"; ctx.fillRect(0, 430, W, 44); ctx.fillStyle = "#e6bc72"; ctx.fillRect(0, 466, W, 18);
    } else if (level.scene === "northamerica26") {
      stars("rgba(255,232,157,.9)", 30, .07); cloudBand("rgba(255,255,255,.2)", 78, .1, .72);
      ctx.fillStyle = "#bc7546"; for (let i = 0; i < 5; i += 1) { ctx.fillRect(45 + i * 42, 382 - i * 25, 190 - i * 84, 88 + i * 25); } ctx.fillStyle = "#f0ca66"; ctx.fillRect(34, 445, 220, 25);
      ctx.fillStyle = "#d8e2e7"; ctx.beginPath(); ctx.moveTo(475, 105); ctx.lineTo(455, 430); ctx.lineTo(495, 430); ctx.closePath(); ctx.fill(); ctx.fillRect(438, 185, 74, 12); ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.ellipse(475, 205, 45, 24, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#e5564f"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(650, 430); ctx.lineTo(704, 235); ctx.lineTo(758, 430); ctx.moveTo(785, 430); ctx.lineTo(839, 235); ctx.lineTo(893, 430); ctx.stroke(); ctx.strokeStyle = "#f2c35a"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(704, 235); ctx.lineTo(839, 235); ctx.stroke(); ctx.strokeStyle = "rgba(255,255,255,.65)"; ctx.lineWidth = 2; for (let x = 720; x < 835; x += 22) { ctx.beginPath(); ctx.moveTo(x, 238); ctx.lineTo(x - 35, 430); ctx.stroke(); }
      ctx.fillStyle = "#314e6b"; ctx.fillRect(0, 465, W, 18);
    }
  }

  function drawPlatform(p) {
    const level = inBonus
      ? (layerScene === "forest" ? { top: "#61d487", base: "#486448", edge: "#17392f" } : (layerScene === "beach" ? { top: "#f4dc87", base: "#c99355", edge: "#5b4933" } : { top: "#f0fdff", base: "#78b8d6", edge: "#315779" }))
      : LEVELS[currentLevel];
    const x = Math.round(p.x - cameraX);
    if (x > W || x + p.w < 0) return;
    drawRoundedRect(x, p.y, p.w, p.h + 12, 8, level.base, level.edge, 4);
    ctx.fillStyle = level.top; ctx.fillRect(x + 3, p.y + 3, p.w - 6, 13);
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(x + 5, p.y + 3, p.w - 10, 5);
    ctx.fillStyle = "rgba(91,43,27,.25)";
    for (let bx = x + 18; bx < x + p.w - 8; bx += 38) ctx.fillRect(bx, p.y + 30, 5, 7);
  }

  function drawCoin(c, time) {
    if (c.collected) return;
    const x = c.x - cameraX;
    if (x < -30 || x > W + 30) return;
    const bob = Math.sin(time * 5 + c.phase) * 5;
    ctx.save(); ctx.translate(x, c.y + bob);
    const squeeze = c.type === "scarf" ? .92 + Math.abs(Math.sin(time * 4 + c.phase)) * .08 : .32 + Math.abs(Math.sin(time * 4 + c.phase)) * .68;
    ctx.scale(squeeze, 1);
    ctx.strokeStyle = "#172133"; ctx.lineWidth = 3;
    if (c.type === "gem") {
      // 世界杯主办城市纪念盾徽。
      ctx.beginPath(); ctx.moveTo(0, -17); ctx.lineTo(14, -11); ctx.lineTo(12, 7); ctx.quadraticCurveTo(7, 15, 0, 18); ctx.quadraticCurveTo(-7, 15, -12, 7); ctx.lineTo(-14, -11); ctx.closePath();
      ctx.fillStyle = "#2459a6"; ctx.fill(); ctx.strokeStyle = "#e8ba3f"; ctx.lineWidth = 3; ctx.stroke();
      ctx.save(); ctx.clip(); ctx.fillStyle = "#c62f49"; ctx.fillRect(-14, -17, 7, 35); ctx.fillStyle = "#f2ca4e"; ctx.fillRect(7, -17, 7, 35); ctx.restore();
      ctx.fillStyle = "#fff8dc"; ctx.font = "1000 8px ui-rounded, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("WC", 0, 1);
    } else if (c.type === "star") {
      ctx.beginPath(); for (let i = 0; i < 10; i += 1) { const a = -Math.PI / 2 + i * Math.PI / 5; const r = i % 2 ? 7 : 17; const px = Math.cos(a) * r; const py = Math.sin(a) * r; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath();
      const starGold = ctx.createRadialGradient(-4, -6, 1, 0, 0, 18); starGold.addColorStop(0, "#fff6a8"); starGold.addColorStop(.5, "#f4c941"); starGold.addColorStop(1, "#b97314");
      ctx.fillStyle = starGold; ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fffdf2"; ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#21335e"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = "#21335e"; ctx.beginPath(); for (let i = 0; i < 5; i += 1) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; const px = Math.cos(a) * 2.8; const py = Math.sin(a) * 2.8; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); ctx.fill();
    } else if (c.type === "lightning") {
      // 射手能量徽章。
      ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(14, -10); ctx.lineTo(12, 10); ctx.lineTo(0, 18); ctx.lineTo(-12, 10); ctx.lineTo(-14, -10); ctx.closePath();
      ctx.fillStyle = "#a8233d"; ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#f6d34f"; ctx.beginPath(); ctx.moveTo(3, -14); ctx.lineTo(-9, 2); ctx.lineTo(-1, 2); ctx.lineTo(-6, 15); ctx.lineTo(11, -5); ctx.lineTo(3, -5); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#6d4412"; ctx.lineWidth = 1.5; ctx.stroke();
    } else if (c.type === "scarf") {
      // 世界杯球迷助威围巾，取代原来的彩虹图标。
      ctx.strokeStyle = "#172133"; ctx.lineWidth = 2.5;
      drawRoundedRect(-19, -8, 38, 16, 4, "#b4243f", "#172133", 2.5);
      ctx.fillStyle = "#244f9b"; ctx.fillRect(-16, -3, 32, 6);
      ctx.fillStyle = "#f3cb4a"; ctx.fillRect(-16, -7, 32, 2); ctx.fillRect(-16, 5, 32, 2);
      ctx.fillStyle = "#fff9e5"; ctx.font = "1000 8px ui-rounded, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("WC", 0, 0);
      ctx.strokeStyle = "#b4243f"; ctx.lineWidth = 2;
      for (const side of [-1, 1]) for (let i = -1; i <= 1; i += 1) { ctx.beginPath(); ctx.moveTo(side * 19, i * 4); ctx.lineTo(side * (23 + Math.abs(i)), i * 5 + 2); ctx.stroke(); }
    } else {
      // 带足球纹样的世界杯纪念金币。
      const medalGold = ctx.createRadialGradient(-5, -6, 1, 0, 0, c.r + 2); medalGold.addColorStop(0, "#fff4a4"); medalGold.addColorStop(.45, "#f4ca3f"); medalGold.addColorStop(1, "#b86c12");
      ctx.beginPath(); ctx.arc(0, 0, c.r, 0, Math.PI * 2); ctx.fillStyle = medalGold; ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "rgba(114,66,15,.65)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, c.r - 4, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#20335f"; ctx.beginPath(); for (let i = 0; i < 5; i += 1) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; const px = Math.cos(a) * 4; const py = Math.sin(a) * 4; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#20335f"; ctx.lineWidth = 1.2; for (let i = 0; i < 5; i += 1) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 4, Math.sin(a) * 4); ctx.lineTo(Math.cos(a) * (c.r - 4), Math.sin(a) * (c.r - 4)); ctx.stroke(); }
    }
    ctx.restore();
  }

  function drawEnemy(e) {
    if (!e.alive) return;
    const x = e.x - cameraX;
    if (x < -60 || x > W + 60) return;
    ctx.save(); ctx.translate(x, e.y);
    if (e.flash > 0) ctx.globalAlpha = .45;
    if (e.type === "dora") {
      ctx.strokeStyle = "#183454"; ctx.lineWidth = 3;
      ctx.fillStyle = "#2e9ee7"; ctx.beginPath(); ctx.ellipse(22, 21, 21, 19, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(22, 24, 16, 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(17, 10, 6, 8, 0, 0, Math.PI * 2); ctx.ellipse(28, 10, 6, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#183454"; ctx.beginPath(); ctx.arc(19, 11, 2, 0, Math.PI * 2); ctx.arc(26, 11, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ef3e44"; ctx.beginPath(); ctx.arc(23, 17, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#ef3e44"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(22, 28, 15, .25, Math.PI - .25); ctx.stroke();
      ctx.fillStyle = "#ffd34e"; ctx.beginPath(); ctx.arc(22, 35, 5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#69431f"; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(10, 38, 10, 4, 0, 0, Math.PI * 2); ctx.ellipse(35, 38, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); return;
    }
    if (e.type === "labubu") {
      ctx.strokeStyle = "#3d2c28"; ctx.lineWidth = 3; ctx.fillStyle = "#b77b57";
      ctx.beginPath(); ctx.moveTo(7, 18); ctx.quadraticCurveTo(3, -8, 12, -14); ctx.quadraticCurveTo(21, -4, 19, 18); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(27, 18); ctx.quadraticCurveTo(28, -9, 37, -13); ctx.quadraticCurveTo(44, 0, 37, 20); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(22, 24, 21, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#f1d1a6"; ctx.beginPath(); ctx.ellipse(22, 27, 16, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#15131a"; ctx.beginPath(); ctx.arc(14, 21, 3, 0, Math.PI * 2); ctx.arc(30, 21, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(9, 29); ctx.quadraticCurveTo(22, 43, 36, 29); ctx.quadraticCurveTo(22, 36, 9, 29); ctx.fill();
      ctx.fillStyle = "#3d2c28"; for (let i = 0; i < 5; i += 1) { ctx.beginPath(); ctx.moveTo(13 + i * 4, 31); ctx.lineTo(15 + i * 4, 36); ctx.lineTo(17 + i * 4, 31); ctx.closePath(); ctx.fill(); }
      ctx.fillRect(5, 37, 14, 4); ctx.fillRect(27, 37, 14, 4);
      ctx.restore(); return;
    }
    if (e.type === "turtle") {
      ctx.fillStyle = "#63c95d"; ctx.beginPath(); ctx.ellipse(23, 24, 21, 17, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#243c2f"; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = "#f0d29b"; ctx.beginPath(); ctx.arc(e.vx > 0 ? 40 : 5, 19, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#f7e37a"; ctx.fillRect(8, 29, 8, 11); ctx.fillRect(29, 29, 8, 11);
      ctx.fillStyle = "#243c2f"; ctx.beginPath(); ctx.arc(e.vx > 0 ? 43 : 2, 17, 2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.beginPath(); ctx.arc(23, 24, 11, 0, Math.PI * 2); ctx.stroke();
      ctx.restore(); return;
    }
    ctx.fillStyle = LEVELS[currentLevel].edge;
    ctx.beginPath(); ctx.moveTo(3, 30); ctx.quadraticCurveTo(3, 4, 22, 2); ctx.quadraticCurveTo(42, 4, 42, 30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#f2cf9d"; ctx.fillRect(9, 20, 27, 14);
    ctx.fillStyle = "#fff"; ctx.fillRect(12, 12, 8, 10); ctx.fillRect(27, 12, 8, 10);
    ctx.fillStyle = "#18212f"; ctx.fillRect(15, 15, 4, 7); ctx.fillRect(28, 15, 4, 7);
    ctx.fillStyle = "#18212f"; ctx.fillRect(2, 34, 17, 6); ctx.fillRect(27, 34, 17, 6);
    ctx.restore();
  }

  function drawPowerUp(item, time) {
    if (item.collected) return;
    const x = item.x - cameraX; if (x < -50 || x > W + 50) return;
    const y = item.y + Math.sin(time * 4 + item.x * .01) * 4;
    const pulse = .45 + Math.sin(time * 6 + item.x * .02) * .18;
    ctx.save(); ctx.translate(x + 17, y + 15);
    ctx.strokeStyle = `rgba(244,202,61,${pulse})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowColor = "#f4ca3d"; ctx.shadowBlur = 11;
    const ballWhite = ctx.createRadialGradient(-5, -7, 1, 0, 0, 16); ballWhite.addColorStop(0, "#ffffff"); ballWhite.addColorStop(.72, "#f8f1dc"); ballWhite.addColorStop(1, "#d9c99f");
    ctx.fillStyle = ballWhite; ctx.strokeStyle = "#172133"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#172f62"; ctx.beginPath(); for (let i = 0; i < 5; i += 1) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; const px = Math.cos(a) * 5; const py = Math.sin(a) * 5; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); ctx.fill();
    const panelColors = ["#c62f49", "#f0c945", "#2656a1", "#c62f49", "#f0c945"];
    for (let i = 0; i < 5; i += 1) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; const px = Math.cos(a) * 10.5; const py = Math.sin(a) * 10.5; ctx.fillStyle = panelColors[i]; ctx.beginPath(); ctx.arc(px, py, 3.1, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#172133"; ctx.lineWidth = 1; ctx.stroke(); ctx.beginPath(); ctx.moveTo(Math.cos(a) * 5, Math.sin(a) * 5); ctx.lineTo(px, py); ctx.stroke(); }
    ctx.fillStyle = "#f2ca45"; ctx.strokeStyle = "#6d4412"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(3, -8); ctx.lineTo(-4, 1); ctx.lineTo(0, 1); ctx.lineTo(-3, 8); ctx.lineTo(7, -3); ctx.lineTo(3, -3); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function drawPipe(pipe, time) {
    const x = pipe.x - cameraX; if (x < -90 || x > W + 90) return;
    const glow = pipe.glow ? .5 + Math.sin(time * 4) * .18 : .28;
    const pipeColors = { forest: ["#4fc57a", "#174b3a"], beach: ["#f0bd50", "#644b28"], snow: ["#71cef0", "#285477"], main: ["#b886f5", "#4b3471"] };
    const colors = pipeColors[pipe.target] || pipeColors.forest;
    ctx.save(); ctx.shadowColor = "#77ffd8"; ctx.shadowBlur = pipe.glow ? 18 : 0;
    drawRoundedRect(x + 7, pipe.y + 12, pipe.w - 14, pipe.h - 12, 5, colors[0], colors[1], 4);
    drawRoundedRect(x, pipe.y, pipe.w, 22, 6, colors[0], colors[1], 4);
    ctx.fillStyle = `rgba(220,255,230,${glow})`; ctx.fillRect(x + 9, pipe.y + 5, 8, pipe.h - 12);
    ctx.shadowBlur = 0; ctx.font = "900 12px ui-rounded, sans-serif"; ctx.textAlign = "center";
    const routeName = LEVELS[currentLevel].routes[pipe.target] || "城市支线";
    const label = `${pipe.target === "main" ? "↑" : "↓"} ${routeName}`;
    const labelWidth = Math.min(190, Math.max(100, ctx.measureText(label).width + 22));
    const labelX = Math.max(4, Math.min(W - labelWidth - 4, x + pipe.w / 2 - labelWidth / 2));
    drawRoundedRect(labelX, pipe.y - 27, labelWidth, 21, 8, "rgba(255,247,223,.92)", colors[1], 2);
    ctx.fillStyle = colors[1]; ctx.fillText(label, labelX + labelWidth / 2, pipe.y - 12);
    ctx.restore();
  }

  function drawFootball(ball) {
    const x = ball.x - cameraX;
    const radius = ball.w / 2;
    ctx.save(); ctx.translate(x + radius, ball.y + radius); ctx.rotate(ball.rotation);
    ctx.shadowColor = ball.owner === "enemy" ? "#ef4d4d" : "rgba(20,30,45,.35)";
    ctx.shadowBlur = ball.owner === "enemy" ? 9 : 5;
    ctx.fillStyle = "#fffdf5"; ctx.strokeStyle = ball.owner === "enemy" ? "#c92e39" : "#172133"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, radius - 1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.fillStyle = "#172133";
    ctx.beginPath();
    for (let i = 0; i < 5; i += 1) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; const px = Math.cos(a) * radius * .34; const py = Math.sin(a) * radius * .34; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
    ctx.closePath(); ctx.fill();
    for (let i = 0; i < 5; i += 1) { const a = i * Math.PI * 2 / 5; ctx.beginPath(); ctx.arc(Math.cos(a) * radius * .67, Math.sin(a) * radius * .67, radius * .16, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }

  function drawHulkForm(run) {
    ctx.strokeStyle = "#263328"; ctx.lineWidth = 3;
    ctx.fillStyle = "#65bd55"; ctx.beginPath(); ctx.arc(21, 17, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#182421"; ctx.beginPath(); ctx.moveTo(5, 14); ctx.lineTo(8, 2); ctx.lineTo(15, 7); ctx.lineTo(21, 0); ctx.lineTo(27, 7); ctx.lineTo(35, 2); ctx.lineTo(38, 15); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#65bd55"; ctx.beginPath(); ctx.moveTo(9, 29); ctx.quadraticCurveTo(21, 22, 34, 29); ctx.lineTo(37, 49); ctx.lineTo(6, 49); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(4, 35, 9, 0, Math.PI * 2); ctx.arc(39, 35, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#32212d"; ctx.fillRect(12, 16, 7, 3); ctx.fillRect(25, 16, 7, 3); ctx.beginPath(); ctx.moveTo(15, 28); ctx.lineTo(29, 28); ctx.lineTo(25, 32); ctx.lineTo(18, 32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#6e49a5"; ctx.fillRect(8, 45, 28, 10); ctx.fillStyle = "#342842"; ctx.fillRect(8, 52 + run, 12, 6); ctx.fillRect(24, 52 - run, 12, 6);
  }

  function drawSpiderForm(run) {
    ctx.strokeStyle = "#222c42"; ctx.lineWidth = 3;
    ctx.fillStyle = "#d83f4d"; ctx.beginPath(); ctx.ellipse(21, 17, 16, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(8, 12); ctx.quadraticCurveTo(14, 7, 18, 13); ctx.quadraticCurveTo(14, 25, 8, 12); ctx.moveTo(34, 12); ctx.quadraticCurveTo(28, 7, 24, 13); ctx.quadraticCurveTo(28, 25, 34, 12); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1; for (let y = 6; y < 29; y += 6) { ctx.beginPath(); ctx.moveTo(6, y); ctx.quadraticCurveTo(21, y + 5, 36, y); ctx.stroke(); }
    drawRoundedRect(9, 30, 25, 24, 7, "#2857a1", "#222c42", 2);
    ctx.fillStyle = "#d83f4d"; ctx.fillRect(9, 30, 25, 10); ctx.fillRect(8, 47, 8, 9); ctx.fillRect(28, 47, 8, 9);
    ctx.fillStyle = "#17243b"; ctx.beginPath(); ctx.arc(21, 42, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(19, 38, 4, 12);
    ctx.fillStyle = "#222c42"; ctx.fillRect(7, 53 + run, 13, 5); ctx.fillRect(24, 53 - run, 13, 5);
  }

  function drawPlayer(time) {
    if (player.invincible > 0 && Math.floor(time * 12) % 2 === 0) return;
    const x = player.x - cameraX;
    const visualScale = player.w / 42;
    ctx.save(); ctx.translate(x + player.w / 2, player.y + player.h); ctx.scale(player.facing * visualScale, visualScale); ctx.translate(-21, -58);
    const run = player.grounded && Math.abs(player.vx) > 30 ? Math.sin(time * 18) * 4 : 0;
    const activeForm = player.heroForm !== "pikachu" ? player.heroForm : equippedSkin;
    if (activeForm === "hulk") { drawHulkForm(run); ctx.restore(); return; }
    if (activeForm === "spider") { drawSpiderForm(run); ctx.restore(); return; }
    const wearingCaptain = activeForm === "captain";
    const wearingStarlight = activeForm === "starlight";

    // Lightning-bolt tail.
    ctx.fillStyle = "#ffd83d"; ctx.strokeStyle = "#5c321f"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(4, 29); ctx.lineTo(-10, 21); ctx.lineTo(-4, 35); ctx.lineTo(-17, 38); ctx.lineTo(2, 49); ctx.lineTo(9, 39); ctx.closePath(); ctx.fill(); ctx.stroke();

    if (wearingCaptain) {
      ctx.strokeStyle = "#3a2c35"; ctx.lineWidth = 3;
      ctx.fillStyle = "#d63d47"; ctx.beginPath(); ctx.arc(3, 37, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(3, 37, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#d63d47"; ctx.beginPath(); ctx.arc(3, 37, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#2d57a2"; ctx.beginPath(); ctx.arc(3, 37, 3.8, 0, Math.PI * 2); ctx.fill();
    } else if (wearingStarlight) {
      ctx.fillStyle = "#e84d55"; ctx.strokeStyle = "#4a2947"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(11, 29); ctx.lineTo(-2, 38); ctx.lineTo(5, 55); ctx.lineTo(18, 47); ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // Long ears with dark tips.
    ctx.fillStyle = "#ffd83d";
    ctx.beginPath(); ctx.moveTo(8, 19); ctx.quadraticCurveTo(3, -12, 12, -20); ctx.quadraticCurveTo(23, -8, 19, 21); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(27, 20); ctx.quadraticCurveTo(30, -12, 39, -18); ctx.quadraticCurveTo(47, -3, 37, 23); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#3b2a22";
    ctx.beginPath(); ctx.moveTo(6, -8); ctx.quadraticCurveTo(7, -17, 12, -20); ctx.lineTo(16, -7); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(33, -7); ctx.quadraticCurveTo(36, -15, 39, -18); ctx.lineTo(43, -5); ctx.closePath(); ctx.fill();

    // Body and head.
    drawRoundedRect(10, 27, 25, 28, 11, "#ffd83d", "#5c321f", 3);
    ctx.beginPath(); ctx.ellipse(22, 22, 20, 18, 0, 0, Math.PI * 2); ctx.fillStyle = "#ffd83d"; ctx.fill(); ctx.stroke();
    if (wearingCaptain) {
      drawRoundedRect(10, 30, 25, 23, 6, "#2857a1", "#3a2c35", 2);
      ctx.fillStyle = "#fff"; ctx.beginPath(); for (let i = 0; i < 10; i += 1) { const a = -Math.PI / 2 + i * Math.PI / 5; const r = i % 2 ? 3 : 7; const px = 22 + Math.cos(a) * r; const py = 38 + Math.sin(a) * r; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.fillRect(11, 45, 5, 8); ctx.fillRect(21, 45, 5, 8); ctx.fillStyle = "#d63d47"; ctx.fillRect(16, 45, 5, 8); ctx.fillRect(26, 45, 8, 8);
      ctx.fillStyle = "#2857a1"; ctx.beginPath(); ctx.arc(22, 18, 19, Math.PI, 0); ctx.lineTo(41, 23); ctx.lineTo(33, 20); ctx.lineTo(29, 12); ctx.lineTo(15, 12); ctx.lineTo(11, 20); ctx.lineTo(3, 23); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "1000 11px sans-serif"; ctx.textAlign = "center"; ctx.fillText("A", 22, 11);
    } else if (wearingStarlight) {
      drawRoundedRect(10, 31, 25, 21, 6, "#31559b", "#4a2947", 2);
      ctx.fillStyle = "#fff7d8"; ctx.beginPath(); ctx.moveTo(13, 31); ctx.lineTo(22, 40); ctx.lineTo(32, 31); ctx.lineTo(28, 29); ctx.lineTo(22, 35); ctx.lineTo(17, 29); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#ffd45b"; ctx.fillRect(11, 45, 23, 4); ctx.beginPath(); ctx.arc(22, 47, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffd45b"; ctx.strokeStyle = "#6b4724"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(14, 5); ctx.lineTo(17, -2); ctx.lineTo(22, 5); ctx.lineTo(28, -2); ctx.lineTo(32, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = "#3b2a22"; ctx.beginPath(); ctx.arc(15, 19, 3.2, 0, Math.PI * 2); ctx.arc(31, 19, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(14, 18, 1.1, 0, Math.PI * 2); ctx.arc(30, 18, 1.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e63b35"; ctx.beginPath(); ctx.arc(8, 28, 5.5, 0, Math.PI * 2); ctx.arc(36, 28, 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#5c321f"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 27); ctx.quadraticCurveTo(23, 31, 27, 27); ctx.stroke();
    ctx.fillStyle = "#5c321f"; ctx.fillRect(9, 51 + run, 13, 6); ctx.fillRect(24, 51 - run, 13, 6);
    ctx.restore();
  }

  const FOOTBALLER_STYLE = {
    neymar: { name: "内马尔", shirt: "#f1ca28", stripe: "#1e8b4b", skin: "#b9784d", hair: "#e9d15f" },
    messi: { name: "梅西", shirt: "#7bc7ee", stripe: "#f5f5f5", skin: "#d89a72", hair: "#443027" },
    ronaldo: { name: "C罗", shirt: "#b61e31", stripe: "#176b45", skin: "#bd805c", hair: "#211b19" },
    haaland: { name: "哈兰德", shirt: "#77d5ee", stripe: "#172958", skin: "#ecc09b", hair: "#f0cf64" },
    mbappe: { name: "姆巴佩", shirt: "#273d94", stripe: "#e74d4a", skin: "#75472f", hair: "#171515" },
    dembele: { name: "登贝莱", shirt: "#202c83", stripe: "#a51f32", skin: "#5c3829", hair: "#171515" },
    vinicius: { name: "维尼修斯", shirt: "#f5f5f5", stripe: "#b6923e", skin: "#5a3526", hair: "#171515" },
  };

  function drawBallCharacter(style, radius, outfit = "default", darkened = false) {
    const base = darkened ? "#16171b" : style.shirt;
    ctx.strokeStyle = "#172133"; ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(0,0,0,.22)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.fillStyle = base; ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, radius - 2, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = darkened ? "#2a2b30" : style.stripe; ctx.fillRect(-radius, radius * .28, radius * 2, radius * .55);
    ctx.fillStyle = darkened ? "#111" : style.skin; ctx.beginPath(); ctx.arc(0, -radius * .19, radius * .58, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = darkened ? "#050505" : style.hair; ctx.beginPath(); ctx.arc(0, -radius * .36, radius * .59, Math.PI, 0); ctx.lineTo(radius * .46, -radius * .12); ctx.quadraticCurveTo(0, -radius * .3, -radius * .5, -radius * .12); ctx.closePath(); ctx.fill();
    if (outfit === "captain") {
      ctx.strokeStyle = "#f0cb57"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-radius * .35, radius * .2); ctx.lineTo(0, radius * .62); ctx.lineTo(radius * .35, radius * .2); ctx.stroke();
      ctx.fillStyle = "#f0cb57"; ctx.beginPath(); ctx.arc(0, radius * .68, radius * .2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#17213b"; ctx.font = `900 ${radius * .22}px sans-serif`; ctx.textAlign = "center"; ctx.fillText("1", 0, radius * .76);
    } else if (outfit === "ninja") {
      ctx.fillStyle = "#f1ca28"; ctx.fillRect(-radius, radius * .22, radius * 2, radius);
      // Compact fallback badge on the jersey; nothing is drawn over the head.
      drawRoundedRect(-radius * .82, radius * .2, radius * .46, radius * .52, 3, "#f0cb57", "#17213b", 1.2);
      ctx.fillStyle = "#17213b"; ctx.font = `1000 ${radius * .3}px ui-rounded, sans-serif`; ctx.textAlign = "center"; ctx.fillText("帅", -radius * .59, radius * .55);
    } else if (outfit === "starlight") {
      ctx.fillStyle = "#31559b"; ctx.fillRect(-radius, radius * .24, radius * 2, radius);
      ctx.fillStyle = "#ffd45b"; ctx.font = `900 ${radius * .45}px sans-serif`; ctx.textAlign = "center"; ctx.fillText("⚽", 0, radius * .76);
    } else if (outfit === "spider") {
      ctx.fillStyle = "#183a68"; ctx.fillRect(-radius, radius * .2, radius * 2, radius);
      ctx.fillStyle = "#ffd45b"; ctx.font = `900 ${radius * .62}px sans-serif`; ctx.textAlign = "center"; ctx.fillText("ϟ", 0, radius * .76);
    } else if (outfit === "hulk") {
      ctx.fillStyle = "#176b5d"; ctx.fillRect(-radius, radius * .2, radius * 2, radius);
      ctx.fillStyle = "#eafaf4"; ctx.font = `900 ${radius * .5}px sans-serif`; ctx.textAlign = "center"; ctx.fillText("GK", 0, radius * .73);
    }
    ctx.restore();
    ctx.fillStyle = "#161923"; ctx.beginPath(); ctx.arc(-radius * .2, -radius * .2, radius * .07, 0, Math.PI * 2); ctx.arc(radius * .2, -radius * .2, radius * .07, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#3b2421"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, radius * .04, radius * .16, .1, Math.PI - .1); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.32)"; ctx.beginPath(); ctx.arc(-radius * .36, -radius * .44, radius * .18, 0, Math.PI * 2); ctx.fill();
  }

  function drawEnemyBall(e) {
    if (!e.alive) return;
    const x = e.x - cameraX;
    if (x < -65 || x > W + 65) return;
    const style = FOOTBALLER_STYLE[e.type] || FOOTBALLER_STYLE.messi;
    ctx.save(); ctx.translate(x + e.w / 2, e.y + e.h / 2);
    if (e.flash > 0) ctx.globalAlpha = .45;
    drawBallCharacter(style, 21);
    drawRoundedRect(-30, -39, 60, 17, 7, "rgba(255,255,255,.94)", "#172133", 2);
    ctx.fillStyle = "#172133"; ctx.font = "900 11px ui-rounded, sans-serif"; ctx.textAlign = "center"; ctx.fillText(style.name, 0, -27);
    ctx.restore();
  }

  function drawPlayerBall(time) {
    if (player.invincible > 0 && Math.floor(time * 12) % 2 === 0) return;
    const x = player.x - cameraX;
    const bounce = player.grounded && Math.abs(player.vx) > 30 ? Math.sin(time * 18) * 2 : 0;
    const activeForm = player.heroForm !== "neymar" ? player.heroForm : equippedSkin;
    const outfit = activeForm === "black" ? "default" : activeForm;
    ctx.save(); ctx.translate(x + player.w / 2, player.y + player.h / 2 + bounce);
    drawBallCharacter(FOOTBALLER_STYLE.neymar, Math.min(player.w, player.h) / 2, outfit, activeForm === "black");
    drawRoundedRect(-35, -player.h / 2 - 24, 70, 18, 8, "rgba(255,255,255,.95)", "#172133", 2);
    ctx.fillStyle = "#172133"; ctx.font = "900 12px ui-rounded, sans-serif"; ctx.textAlign = "center"; ctx.fillText("内马尔", 0, -player.h / 2 - 11);
    ctx.restore();
  }

  function drawCollectibleFigure(id, centerX, bottomY, displayHeight, facing = 1, form = "default", opacity = 1) {
    const image = form === "barca" ? (BARCA_CHARACTER_IMAGES[id] || CHARACTER_IMAGES[id]) : CHARACTER_IMAGES[id];
    const meta = PLAYER_META[id] || PLAYER_META.neymar;
    const ready = image && image.complete && image.naturalWidth > 0;
    const displayWidth = ready ? displayHeight * image.naturalWidth / image.naturalHeight : displayHeight * .55;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(centerX, bottomY);
    ctx.fillStyle = "rgba(18,27,42,.2)";
    ctx.beginPath(); ctx.ellipse(0, 1, displayWidth * .34, 4, 0, 0, Math.PI * 2); ctx.fill();
    if (form === "black") ctx.filter = "brightness(.2) saturate(.35)";
    if (form === "starlight") { ctx.shadowColor = "#ffd45b"; ctx.shadowBlur = 14; }
    if (ready) {
      ctx.drawImage(image, -displayWidth / 2, -displayHeight, displayWidth, displayHeight);
    } else {
      drawRoundedRect(-displayWidth / 2, -displayHeight, displayWidth, displayHeight, 16, "#e9c25b", "#172133", 3);
    }
    ctx.filter = "none"; ctx.shadowBlur = 0;
    // 强制把准确号码印在胸前，避免生成素材漏号或错号。
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `1000 ${Math.max(9, displayHeight * .12)}px ui-rounded, sans-serif`;
    ctx.lineWidth = Math.max(2, displayHeight * .025);
    const displayNumber = form === "barca" ? (meta.barcaNumber || meta.number) : meta.number;
    ctx.strokeStyle = form === "barca" ? "rgba(33,28,72,.92)" : "rgba(255,255,255,.88)";
    ctx.strokeText(String(displayNumber), 0, -displayHeight * .41);
    ctx.fillStyle = form === "barca" ? "#f1c94f" : meta.numberColor;
    ctx.fillText(String(displayNumber), 0, -displayHeight * .41);
    if (form === "starlight") {
      // Golden boots sit on the existing feet without changing the footballer silhouette.
      ctx.save(); ctx.shadowColor = "#ffe77a"; ctx.shadowBlur = 7; ctx.fillStyle = "#e9b72d"; ctx.strokeStyle = "#805414"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(-displayWidth * .17, -displayHeight * .045, displayWidth * .14, displayHeight * .035, -.12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(displayWidth * .22, -displayHeight * .105, displayWidth * .13, displayHeight * .032, .18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    } else if (form === "captain") {
      // A red-blue ribbon and gold champion medal hang below Neymar's collar.
      ctx.save(); ctx.strokeStyle = "#2b56a0"; ctx.lineWidth = Math.max(2, displayHeight * .025);
      ctx.beginPath(); ctx.moveTo(-displayWidth * .09, -displayHeight * .6); ctx.lineTo(0, -displayHeight * .515); ctx.lineTo(displayWidth * .09, -displayHeight * .6); ctx.stroke();
      ctx.strokeStyle = "#d9414d"; ctx.lineWidth = Math.max(1, displayHeight * .011);
      ctx.beginPath(); ctx.moveTo(-displayWidth * .07, -displayHeight * .6); ctx.lineTo(0, -displayHeight * .525); ctx.lineTo(displayWidth * .07, -displayHeight * .6); ctx.stroke();
      const medal = ctx.createRadialGradient(-2, -displayHeight * .52, 1, 0, -displayHeight * .5, displayHeight * .065);
      medal.addColorStop(0, "#fff4a6"); medal.addColorStop(.45, "#f0c33f"); medal.addColorStop(1, "#a86b12");
      ctx.fillStyle = medal; ctx.strokeStyle = "#755019"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(0, -displayHeight * .5, displayHeight * .06, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#755019"; ctx.font = `1000 ${displayHeight * .055}px ui-rounded, sans-serif`; ctx.textAlign = "center"; ctx.fillText("1", 0, -displayHeight * .497);
      ctx.restore();
    } else if (form === "ninja") {
      // Gold captain armband follows the upper-left arm; the head stays untouched.
      ctx.save(); ctx.translate(-displayWidth * .28, -displayHeight * .51); ctx.rotate(.24);
      ctx.shadowColor = "rgba(16,26,48,.3)"; ctx.shadowBlur = 3; ctx.shadowOffsetY = 1.5;
      drawRoundedRect(-displayWidth * .09, -displayHeight * .04, displayWidth * .18, displayHeight * .08, 3, "#f0cb57", "#17213b", 1.4);
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      ctx.strokeStyle = "#fff0a4"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-displayWidth * .065, -displayHeight * .025); ctx.lineTo(-displayWidth * .065, displayHeight * .025); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(displayWidth * .065, -displayHeight * .025); ctx.lineTo(displayWidth * .065, displayHeight * .025); ctx.stroke();
      ctx.fillStyle = "#17213b"; ctx.font = `1000 ${displayHeight * .045}px ui-rounded, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("帅", 0, 0);
      ctx.restore();
    } else if (form === "spider") {
      // Slim navy shin guards with gold lightning marks.
      ctx.save(); ctx.translate(displayWidth * .14, -displayHeight * .2); ctx.rotate(.14);
      drawRoundedRect(-displayWidth * .07, -displayHeight * .065, displayWidth * .14, displayHeight * .13, 3, "#173762", "#f0c94d", 1.2);
      ctx.fillStyle = "#f0c94d"; ctx.font = `1000 ${displayHeight * .09}px sans-serif`; ctx.textAlign = "center"; ctx.fillText("ϟ", 0, displayHeight * .018);
      ctx.restore();
    } else if (form === "hulk") {
      // Teal goalkeeper gloves accent the hands; the body keeps Neymar's normal colors and size.
      const gloves = [
        { x: -displayWidth * .39, y: -displayHeight * .4, rot: -.26 },
        { x: displayWidth * .39, y: -displayHeight * .4, rot: .26 },
      ];
      for (const glove of gloves) {
        ctx.save(); ctx.translate(glove.x, glove.y); ctx.rotate(glove.rot);
        drawRoundedRect(-displayWidth * .07, -displayHeight * .045, displayWidth * .14, displayHeight * .09, 4, "#1c9b82", "#f0c94d", 1.3);
        ctx.strokeStyle = "#eafff8"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-displayWidth * .035, -displayHeight * .025); ctx.lineTo(-displayWidth * .035, displayHeight * .02); ctx.moveTo(0, -displayHeight * .03); ctx.lineTo(0, displayHeight * .022); ctx.moveTo(displayWidth * .035, -displayHeight * .025); ctx.lineTo(displayWidth * .035, displayHeight * .02); ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawTauntEffects(style, displayHeight, elapsed, front) {
    const beat = Math.sin(elapsed * 13);
    const skin = "#c98b62";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (!front && style === "meditate") {
      ctx.strokeStyle = "rgba(98,197,231,.72)"; ctx.lineWidth = 2.5;
      for (let ring = 0; ring < 3; ring += 1) {
        ctx.beginPath(); ctx.ellipse(0, -displayHeight * .48, 25 + ring * 8 + beat * 2, 11 + ring * 4, 0, 0, Math.PI * 2); ctx.stroke();
      }
    } else if (!front && style === "spread") {
      ctx.strokeStyle = "#f7f2dc"; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(-8, -displayHeight * .56); ctx.lineTo(-42, -displayHeight * .52); ctx.moveTo(8, -displayHeight * .56); ctx.lineTo(42, -displayHeight * .52); ctx.stroke();
      ctx.strokeStyle = skin; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(-32, -displayHeight * .52); ctx.lineTo(-47, -displayHeight * .56); ctx.moveTo(32, -displayHeight * .52); ctx.lineTo(47, -displayHeight * .56); ctx.stroke();
    } else if (!front && style === "point") {
      ctx.strokeStyle = "#c92f4f"; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(-8, -displayHeight * .55); ctx.lineTo(-25, -displayHeight * .86); ctx.moveTo(8, -displayHeight * .55); ctx.lineTo(25, -displayHeight * .86); ctx.stroke();
      ctx.fillStyle = "#f4ca48"; ctx.font = "1000 15px sans-serif"; ctx.textAlign = "center"; ctx.fillText("★", 0, -displayHeight - 7);
    } else if (!front && style === "siu") {
      ctx.strokeStyle = "rgba(181,29,44,.56)"; ctx.lineWidth = 3;
      for (const side of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(side * 17, -displayHeight * .22); ctx.lineTo(side * 35, -displayHeight * .07); ctx.stroke();
      }
    } else if (!front && style === "slide") {
      ctx.strokeStyle = "rgba(39,59,112,.55)"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-42, -7); ctx.lineTo(-18, -7); ctx.moveTo(-49, 1); ctx.lineTo(-22, 1); ctx.stroke();
    }

    if (front && style === "arms") {
      ctx.strokeStyle = "#243c94"; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(-18, -displayHeight * .55); ctx.lineTo(16, -displayHeight * .39); ctx.moveTo(18, -displayHeight * .55); ctx.lineTo(-16, -displayHeight * .39); ctx.stroke();
      ctx.strokeStyle = skin; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-8, -displayHeight * .5); ctx.lineTo(15, -displayHeight * .4); ctx.moveTo(8, -displayHeight * .5); ctx.lineTo(-15, -displayHeight * .4); ctx.stroke();
    } else if (front && style === "meditate") {
      ctx.strokeStyle = "#75d4ee"; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(-8, -10, 15, .15, Math.PI - .35); ctx.moveTo(8, -10); ctx.arc(8, -10, 15, .35, Math.PI - .15); ctx.stroke();
      ctx.fillStyle = "#f7df55"; ctx.font = "1000 13px sans-serif"; ctx.textAlign = "center"; ctx.fillText("✦", 0, -displayHeight * .72 + beat * 2);
    } else if (front && style === "dance") {
      ctx.fillStyle = "#f4ca48"; ctx.font = "1000 17px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("♪", -31, -displayHeight * .63 + beat * 3); ctx.fillText("♫", 31, -displayHeight * .78 - beat * 3);
    } else if (front && style === "slide") {
      ctx.strokeStyle = skin; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(9, -displayHeight * .58); ctx.lineTo(25, -displayHeight * .82); ctx.stroke();
      ctx.fillStyle = "#f4ca48"; ctx.font = "1000 13px sans-serif"; ctx.fillText("✊", 24, -displayHeight * .85);
    }
  }

  function drawEnemyFigurine(enemy, time) {
    if (!enemy.alive) return;
    const x = enemy.x - cameraX;
    if (x < -80 || x > W + 80) return;
    const meta = PLAYER_META[enemy.type] || PLAYER_META.messi;
    const displayHeight = enemy.type === "haaland" || enemy.type === "kane" ? 96 : 90;
    const taunt = FOOTBALL_TAUNTS[enemy.type];
    const taunting = Boolean(taunt && enemy.tauntTimer > 0);
    const elapsed = taunting ? Math.max(0, enemy.tauntDuration - enemy.tauntTimer) : 0;
    const progress = taunting ? Math.min(1, elapsed / enemy.tauntDuration) : 0;
    let offsetX = 0; let offsetY = 0; let rotation = 0; let scaleX = 1; let scaleY = 1;
    if (taunting) {
      if (taunt.style === "siu") { offsetY = -Math.sin(progress * Math.PI) * 18; rotation = Math.sin(progress * Math.PI * 2) * .1; }
      else if (taunt.style === "meditate") { offsetY = 4 + Math.sin(elapsed * 7) * 1.5; scaleY = .78; scaleX = 1.06; }
      else if (taunt.style === "arms") { scaleX = 1.04; offsetY = Math.sin(elapsed * 8) * 1.5; }
      else if (taunt.style === "point") { offsetX = enemy.tauntFacing * progress * 12; offsetY = progress * 5; rotation = enemy.tauntFacing * -.08; scaleY = .9; }
      else if (taunt.style === "dance") { offsetX = Math.sin(elapsed * 13) * 7; rotation = Math.sin(elapsed * 13) * .12; }
      else if (taunt.style === "spread") { offsetY = -4 - Math.sin(progress * Math.PI) * 4; scaleX = 1.05; }
      else if (taunt.style === "slide") { offsetX = enemy.tauntFacing * progress * 15; offsetY = progress * 5; rotation = enemy.tauntFacing * -.07; scaleY = .9; }
    }
    const centerX = x + enemy.w / 2 + offsetX;
    const bottomY = enemy.y + enemy.h + offsetY;
    ctx.save(); ctx.translate(centerX, bottomY); ctx.rotate(rotation); ctx.scale(scaleX, scaleY);
    if (taunting) drawTauntEffects(taunt.style, displayHeight, elapsed, false);
    drawCollectibleFigure(enemy.type, 0, 0, displayHeight, taunting ? enemy.tauntFacing : (enemy.vx >= 0 ? 1 : -1), "default", enemy.flash > 0 ? .45 : 1);
    if (taunting) drawTauntEffects(taunt.style, displayHeight, elapsed, true);
    ctx.restore();
    ctx.save();
    if (taunting) {
      const bubbleWidth = Math.max(86, ctx.measureText(taunt.label).width + 38);
      drawRoundedRect(centerX - bubbleWidth / 2, bottomY - displayHeight - 30, bubbleWidth, 23, 9, "rgba(255,247,223,.97)", taunt.color, 2.5);
      ctx.fillStyle = taunt.color; ctx.font = "1000 12px ui-rounded, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`⚽ ${taunt.label}`, centerX, bottomY - displayHeight - 14);
    } else {
      drawRoundedRect(x - 9, enemy.y - displayHeight - 15, 64, 17, 7, "rgba(255,255,255,.95)", "#172133", 2);
      ctx.fillStyle = "#172133"; ctx.font = "900 10px ui-rounded, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`${meta.name} · ${meta.number}`, x + 23, enemy.y - displayHeight - 3);
    }
    ctx.restore();
  }

  function drawPlayerFigurine(time) {
    if (player.invincible > 0 && Math.floor(time * 12) % 2 === 0) return;
    const x = player.x - cameraX;
    const bounce = player.grounded && Math.abs(player.vx) > 30 ? Math.sin(time * 18) * 2 : 0;
    const activeForm = player.heroForm !== "neymar" ? player.heroForm : equippedSkin;
    const displayHeight = Math.max(108, player.h * 1.9);
    const centerX = x + player.w / 2;
    const bottomY = player.y + player.h + bounce;
    const msnOutfit = msnStage === 3 ? "barca" : "default";
    if (msnStage >= 2) drawCollectibleFigure("messi", centerX - 33, bottomY + 1, displayHeight * .82, player.facing, msnOutfit, .96);
    if (msnStage >= 3) drawCollectibleFigure("suarez", centerX + 34, bottomY + 1, displayHeight * .82, player.facing, "barca", .96);
    drawCollectibleFigure("neymar", centerX, bottomY, displayHeight, player.facing, msnStage === 3 ? "barca" : activeForm);
    const trophyWon = hasWorldCupTrophy();
    if (trophyWon) drawWorldCupTrophy(centerX, bottomY - displayHeight * .31, time);
    ctx.save();
    const teamLabel = trophyWon ? "🏆 巴萨MSN合捧大力神杯" : (msnStage === 3 ? "🔵🔴 巴萨MSN 3/3" : (msnStage === 2 ? "MSN 2/3 · 梅西加入" : "内马尔 · 10"));
    const labelWidth = trophyWon ? 154 : (msnStage === 1 ? 78 : 124);
    drawRoundedRect(centerX - labelWidth / 2, bottomY - displayHeight - 20, labelWidth, 20, 8, trophyWon ? "rgba(255,235,126,.97)" : "rgba(255,255,255,.97)", "#172133", 2);
    ctx.fillStyle = "#172133"; ctx.font = "900 11px ui-rounded, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(teamLabel, centerX, bottomY - displayHeight - 6);
    ctx.restore();
  }

  function drawWorldCupTrophy(x, y, time) {
    const sway = Math.sin(time * 3) * .35;
    ctx.save(); ctx.translate(x, y + sway);
    // Four small hands grip the cup directly; no long horizontal arm bars.
    const hands = [
      { color: "#d89a72", x: -6, y: 3 },
      { color: "#b9784d", x: -3.5, y: 10.5 },
      { color: "#b9784d", x: 3.5, y: 10.5 },
      { color: "#c17a50", x: 6, y: 3 },
    ];
    for (const hand of hands) {
      ctx.fillStyle = hand.color; ctx.strokeStyle = "#5c3b2f"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(hand.x, hand.y, 2.45, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }

    // At 72% scale the trophy is about one-third of Neymar's height instead of half.
    ctx.save(); ctx.scale(.72, .72);
    ctx.shadowColor = "rgba(255,210,62,.8)"; ctx.shadowBlur = 9;
    const gold = ctx.createLinearGradient(-10, -24, 10, 22);
    gold.addColorStop(0, "#fff8bd");
    gold.addColorStop(.2, "#f5d35d");
    gold.addColorStop(.52, "#dca52a");
    gold.addColorStop(.78, "#f3ca4e");
    gold.addColorStop(1, "#9b6212");

    // Two sculpted figures rise from the base and hold up the globe.
    ctx.fillStyle = gold; ctx.strokeStyle = "#6f4a13"; ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-5.8, 14);
    ctx.quadraticCurveTo(-10.2, 7, -8.2, -1.2);
    ctx.quadraticCurveTo(-7.3, -6.2, -3.9, -8.7);
    ctx.lineTo(-1.2, -5.4);
    ctx.quadraticCurveTo(-4.6, -1.4, -3.1, 5.2);
    ctx.lineTo(-1.4, 14);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5.8, 14);
    ctx.quadraticCurveTo(10.2, 7, 8.2, -1.2);
    ctx.quadraticCurveTo(7.3, -6.2, 3.9, -8.7);
    ctx.lineTo(1.2, -5.4);
    ctx.quadraticCurveTo(4.6, -1.4, 3.1, 5.2);
    ctx.lineTo(1.4, 14);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Warm central core gives the thin trophy a solid, premium silhouette.
    ctx.beginPath();
    ctx.moveTo(-2.8, -5.5); ctx.quadraticCurveTo(-4.2, 4, -2.8, 14);
    ctx.lineTo(2.8, 14); ctx.quadraticCurveTo(4.2, 4, 2.8, -5.5);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Golden globe with subtle latitude, longitude and continent details.
    const globe = ctx.createRadialGradient(-2.6, -16.8, 1, 0, -14.5, 8.7);
    globe.addColorStop(0, "#fff9c4"); globe.addColorStop(.35, "#f6d45d"); globe.addColorStop(.72, "#d79b20"); globe.addColorStop(1, "#925811");
    ctx.fillStyle = globe; ctx.strokeStyle = "#6c4711"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, -14.5, 8.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(120,72,12,.58)"; ctx.lineWidth = .75;
    ctx.beginPath(); ctx.ellipse(0, -14.5, 3.8, 8.1, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -14.5, 8.1, 3.4, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(133,78,12,.72)";
    ctx.beginPath();
    ctx.moveTo(-5.7, -18.4); ctx.quadraticCurveTo(-2.8, -21, -.6, -18.7);
    ctx.lineTo(-1.5, -15.2); ctx.lineTo(-4.3, -14); ctx.lineTo(-6.2, -16.1); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(1.1, -13.5); ctx.quadraticCurveTo(4.8, -14.8, 6.4, -12.1);
    ctx.lineTo(4.1, -7.9); ctx.lineTo(1.7, -9.8); ctx.closePath(); ctx.fill();

    // Malachite-green base and polished gold collars.
    ctx.fillStyle = "#e7bb43"; ctx.strokeStyle = "#6f4a13"; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.ellipse(0, 14, 7.4, 2.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    const green = ctx.createLinearGradient(-8, 15, 8, 23);
    green.addColorStop(0, "#1d8f69"); green.addColorStop(.5, "#53c58d"); green.addColorStop(1, "#07533f");
    ctx.fillStyle = green;
    ctx.beginPath(); ctx.moveTo(-7, 15); ctx.lineTo(-8.8, 22.5); ctx.lineTo(8.8, 22.5); ctx.lineTo(7, 15); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#d9a935";
    drawRoundedRect(-10, 21.3, 20, 4.8, 1.8, "#d9a935", "#6f4a13", 1.2);
    ctx.fillStyle = "rgba(190,241,202,.55)"; ctx.fillRect(-4.8, 16.6, 1.2, 4.4);

    // Small animated glints sell the metallic finish without overwhelming the characters.
    const glint = .7 + Math.sin(time * 4) * .25;
    ctx.globalAlpha = glint; ctx.fillStyle = "#fffbe2";
    ctx.beginPath(); ctx.moveTo(-11, -19); ctx.lineTo(-9.8, -16.4); ctx.lineTo(-7.2, -15.2); ctx.lineTo(-9.8, -14); ctx.lineTo(-11, -11.4); ctx.lineTo(-12.2, -14); ctx.lineTo(-14.8, -15.2); ctx.lineTo(-12.2, -16.4); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.restore();
  }

  function drawFlag() {
    const level = LEVELS[currentLevel];
    const x = goalX - cameraX;
    if (x < -80 || x > W + 100) return;
    ctx.fillStyle = "#edf3ed"; ctx.fillRect(x, 118, 10, FLOOR_Y - 118);
    ctx.fillStyle = "#18212f"; ctx.beginPath(); ctx.arc(x + 5, 112, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = level.accent; ctx.beginPath(); ctx.moveTo(x + 10, 135); ctx.lineTo(x + 95, 165); ctx.lineTo(x + 10, 200); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "900 20px sans-serif"; ctx.fillText("★", x + 39, 172);
  }

  function drawHud() {
    const level = LEVELS[currentLevel];
    const rewardScore = totalCoins + coins;
    const progressScore = journeyScore(rewardScore);
    const stampCount = completedLevels.size;
    const trophyWon = hasWorldCupTrophy();
    drawRoundedRect(18, 17, 560, 78, 15, "rgba(255,247,223,.93)", "#18212f", 3);
    ctx.fillStyle = "#18212f"; ctx.font = "900 19px ui-rounded, sans-serif"; ctx.textAlign = "left";
    ctx.fillText(`第${currentLevel + 1}关`, 36, 49);
    ctx.fillText(`★ ${String(coins).padStart(2, "0")}`, 112, 49);
    ctx.fillText(`♥ ${lives}`, 207, 49);
    ctx.font = "800 13px ui-rounded, sans-serif";
    ctx.fillText(inBonus ? level.routes[layerScene] : `${level.name} · ${level.difficulty}`, 282, 48);
    const progress = Math.min(1, player.x / goalX);
    ctx.fillStyle = "#56606d"; ctx.font = "800 11px ui-rounded, sans-serif"; ctx.fillText("关卡进度", 36, 78);
    ctx.fillStyle = "#cad3d2"; ctx.fillRect(108, 66, 445, 11);
    ctx.fillStyle = level.accent; ctx.fillRect(108, 66, 445 * progress, 11);
    ctx.strokeStyle = "#18212f"; ctx.lineWidth = 2; ctx.strokeRect(108, 66, 445, 11);
    const trophyBoxX = W - 163; const trophyBoxW = 145;
    const trioBoxX = W - 365; const trioBoxW = 185;
    drawRoundedRect(trophyBoxX, 17, trophyBoxW, 48, 14, "rgba(255,247,223,.93)", "#18212f", 3);
    drawRoundedRect(trioBoxX, 17, trioBoxW, 48, 14, "rgba(255,247,223,.93)", "#18212f", 3);
    const msnTarget = msnStage === 1 ? 500 : 1000;
    const stampTarget = msnStage === 1 ? 3 : 6;
    ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = trophyWon ? "#a76b00" : "#2857a1"; ctx.font = "900 14px ui-rounded, sans-serif";
    ctx.fillText(trophyWon ? "🏆 大力神杯" : (msnStage === 3 ? `🧩 奖杯 ${trophyPieceCount()}/3` : `🗺 印章 ${stampCount}/10`), trophyBoxX + trophyBoxW / 2, 41);
    ctx.fillStyle = trophyWon ? "#a76b00" : "#475264"; ctx.font = "900 13px ui-rounded, sans-serif";
    ctx.fillText(msnStage === 3 ? "⚽ MSN 3/3 · 巴萨战袍" : `MSN成长 ${Math.min(msnTarget, progressScore)}/${msnTarget}分 · ${Math.min(stampTarget, stampCount)}/${stampTarget}城`, trioBoxX + trioBoxW / 2, msnStage === 3 ? 41 : 34);
    ctx.restore();
    if (msnStage < 3) {
      ctx.fillStyle = "#d5d8d4"; ctx.fillRect(trioBoxX + 18, 47, 149, 7);
      ctx.fillStyle = msnStage === 2 ? "#4c7bd1" : "#f5b83d";
      const scoreProgress = Math.min(1, progressScore / msnTarget);
      const cityProgress = Math.min(1, stampCount / stampTarget);
      ctx.fillRect(trioBoxX + 18, 47, 149 * Math.min(scoreProgress, cityProgress), 7);
    }
  }

  function render(time) {
    drawBackground();
    for (const p of platforms) drawPlatform(p);
    for (const pipe of pipes) drawPipe(pipe, time);
    for (const c of coinItems) drawCoin(c, time);
    for (const item of powerUps) drawPowerUp(item, time);
    for (const e of enemies) drawEnemyFigurine(e, time);
    for (const ball of footballs) drawFootball(ball);
    drawFlag();
    drawPlayerFigurine(time);
    drawHud();
  }

  function loop(timestamp) {
    const dt = Math.min(.033, (timestamp - lastTime) / 1000 || 0);
    lastTime = timestamp;
    update(dt); render(timestamp / 1000);
    requestAnimationFrame(loop);
  }

  window.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) event.preventDefault();
    keys.add(event.code);
    if (["Space", "ArrowUp", "KeyW"].includes(event.code) && !event.repeat) jump();
    if (["KeyF", "KeyX"].includes(event.code) && !event.repeat) shoot();
    if (["ArrowDown", "KeyS"].includes(event.code) && !event.repeat) tryPipe();
  });
  window.addEventListener("keyup", (event) => keys.delete(event.code));
  window.addEventListener("blur", () => keys.clear());

  document.querySelector("#startButton").addEventListener("click", startGame);
  levelSelect.addEventListener("change", () => updateSceneOptions());
  document.querySelector("#playAgainButton").addEventListener("click", () => {
    if (levelWon && currentLevel === LEVELS.length - 1) {
      const nextMissingLevel = LEVELS.findIndex((_, index) => !completedLevels.has(index));
      levelSelect.value = String(nextMissingLevel >= 0 ? nextMissingLevel : 0);
      sceneSelect.value = "main";
      updateSceneOptions(Number(levelSelect.value));
      startGame();
    }
    else continueGame();
  });
  document.querySelector("#restartButton").addEventListener("click", () => {
    if (!running) startGame();
    else { resetLevel(); messageScreen.classList.add("hidden"); startMusic(); }
  });
  soundButton.addEventListener("click", () => {
    soundOn = !soundOn;
    soundButton.textContent = `音乐：${soundOn ? MUSIC.label : "关"}`;
    if (soundOn) { beep(440, .08); if (running && !finished) startMusic(); }
    else stopMusic();
  });
  document.querySelector("#shopButton").addEventListener("click", openShop);
  document.querySelector("#closeShopButton").addEventListener("click", closeShop);
  document.querySelectorAll("[data-skin]").forEach((button) => {
    button.addEventListener("click", () => {
      const skin = button.dataset.skin;
      const cost = Number(button.dataset.cost) || 0;
      if (ownedSkins.has(skin)) { equipSkin(skin); return; }
      if (wallet < cost) {
        rewardTitle.textContent = "宝藏不足";
        rewardDescription.textContent = `还需要 ${cost - wallet} 宝藏积分`;
        rewardToast.classList.remove("hidden");
        window.setTimeout(() => rewardToast.classList.add("hidden"), 1800);
        return;
      }
      wallet -= cost; ownedSkins.add(skin); equipSkin(skin); addWallet(0);
    });
  });

  // 补发历史最高分已达到的里程碑卡片，旧存档升级后也不会漏卡。
  for (const card of STAR_CARDS) {
    if (bestScore >= card.milestone && completedLevels.size >= card.cities) ownedCards.add(card.id);
  }
  updateLevelOptionProgress();
  saveCards();
  updateSceneOptions(0);
  resetLevel();
  updateShopUI();
  requestAnimationFrame(loop);
})();
