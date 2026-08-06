# 当前状态与下一步

更新时间：2026-08-06

## 当前仓库状态

- 分支：`main`
- 本轮建立项目记忆前，工作区为干净状态。
- 功能基线 HEAD（建立项目记忆前）：`1d99408 Keep Ronaldinho as an enemy with rush reward`
- 项目记忆文件的提交号以 `git log -1 --oneline` 为准，避免在本文件中形成自引用提交号。
- 本地跟踪：`main...github/main`
- 已配置远程：
  - `github`: `https://github.com/danbaishi62/msn-football-adventure.git`
  - `sites`: ChatGPT Sites 源仓库
- 旧任务截图与文字称仓库已迁移到 `lara-creative-lab/msn-football-adventure`，但本地远程仍是 `danbaishi62/...`。发布前必须通过 GitHub 页面或远程读回核实真实主仓库和 Pages 地址；未核实前不要擅自改 remote。

## 已完成且必须保留

- MSN 球星大冒险基础玩法与 10 关世界杯旅程。
- 20 秒关卡计时。
- MSN 成长和巴萨战袍阶段。
- 第 10 关 Infantino 双血条、三球连射 Boss。
- 庆祝气泡非阻塞。
- 资产可点击放大、庆祝表情收藏、资产页两大分类。
- 小罗作为敌人；击败后 Neymar 保持原形并获得 8 秒桑巴冲锋。
- 当前测试对上述小罗规则有明确的正向和反向断言。

## 当前待办（来自旧任务最后一组需求）

1. 删除所有资产放大页面顶部的 `ASSET VIEW`。
2. 重新设计 10 枚城市徽章：根据各届世界杯和城市主题采用不同异形轮廓、金属材质与构图，参考实体徽章照片；不能只换图标或继续共用同一个圆形底座。
3. 旧任务还提到“删除主页截图红框内的文字”，但现存已保存参考图只能明确定位 `ASSET VIEW`。开始实现前应让用户重新附上该主页截图，或在旧任务中定位原图，避免误删其他页面文案。
4. 用户最后要求“把这些东西合并到一起发布”。因此完成实现、视觉核对、`npm test` 和安全扫描后，可以进入发布流程；仍需先核实实际 GitHub 主仓库。

## 参考资料

- `docs/references/asset-preview-remove-text.png`：红框标出需要删除的 `ASSET VIEW`。
- `docs/references/physical-badge-shape-reference.png`：实体珐琅/金属徽章合集，用于异形轮廓、材质和主题构图参考。
- `docs/references/README.md`：参考图使用说明。

## 新任务启动口令

在同一个项目中新建任务后，只需输入：

> 按 AGENTS.md 和项目文档继续。先读取 CURRENT_STATE，再处理我的新需求；不要回顾整段旧聊天。

## 完成任务后的维护

- 更新本文件的 HEAD、工作区状态、已完成项和剩余待办。
- 新的不可变规则写入 `DECISIONS.md`。
- 产品长期行为变化写入 `GAME_SPEC.md`。
- 关键新参考图复制到 `docs/references/` 并在 README 中说明。
