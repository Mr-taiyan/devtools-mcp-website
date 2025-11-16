# DevFest Workshop — Site & Deployment

这是一个用于记录 Google DevFest Workshop（Chrome DevTools MCP Server 主题）的静态网站。仓库包含简单的页面与一个 GitHub Actions workflow，便于部署到 GitHub Pages。

快速说明

- 本地预览（推荐）：
```
cd 'c:\Users\Anthony_Chen1\Documents\devtools-mcp-website'
npx live-server --port=8000
```

- GitHub 部署：
  1. 在 GitHub 上创建一个新的仓库（例如 `devtools-mcp-website`）。
  2. 将本地代码推到该仓库（`git remote add origin ...` / `git push -u origin main`）。
  3. workflow 位于 `.github/workflows/deploy.yml`，当你 push 到 `main`/`master` 分支时会触发部署。

可选：使用 DevTools MCP

- Workflow 中包含一个可选步骤，用来在 CI 中探测 DevTools MCP 的 WebSocket 地址（`MCP_WS_URL`）。如果你希望在 Actions 中运行该探测，请在仓库的 Settings → Secrets 中添加 `MCP_WS_URL`（例如 `ws://mcp-host:9222`）。该步骤是非必需的，探测失败不会阻止部署。

关于我自动在你的 GitHub 上创建仓库的请求

- 我无法在没有你授权（个人访问令牌）的情况下替你创建 GitHub 仓库或直接把代码推到你的账号。若你希望我代为创建仓库并推送，请提供一个有 `repo` 权限的 GitHub Personal Access Token（PAT），或者在你本地/你的账号中手动创建仓库并把代码 push 上去。

敏感信息与登录

- 如需我使用任何账号或令牌，我会先暂停并请求你确认（不会自动使用任何凭据）。

如果你想让我继续：
- A) 我可以帮你生成创建仓库并将当前目录内容推送到 GitHub 的 PowerShell 脚本，但需要你在运行脚本前提供 PAT；或
- B) 你可以手动在 GitHub 上创建仓库，然后我可以继续帮助你微调 workflow 或添加自动化与 MCP 集成示例。
