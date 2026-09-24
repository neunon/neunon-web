---
description: もう片方のエージェントの続きから作業を再開する（fetch → 作業ログ確認 → 状況報告）
---

もう片方のエージェント（Codex / Claude Code）が中断した作業を引き取る。
**ローカルの状態を信じずに、必ずリモートから確認する。**

1. `git fetch origin` を実行する
2. `docs/AGENT_LOG.md` を読む。これが引き継ぎの正
3. `git log --oneline -10 origin/main` と `git branch -a` で、相手が何をしたか確認する
4. AGENT_LOG に作業ブランチが書かれていれば `git switch <branch> && git pull`。
   なければ `git switch main && git pull`
5. `npm run typecheck` を流して、引き継いだ状態が壊れていないか確認する

そのうえで、**着手前に次の3点を報告する**。

- 相手がどこまでやったか（コミット単位で）
- 作業ログの「次にやること」の先頭は何か
- 引き取った状態に問題がないか（typecheck の結果、未解決のコンフリクト等）

報告してから着手すること。勝手に方針を変えない。

$ARGUMENTS
