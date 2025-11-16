# create-and-push-repo.ps1
# 在本地创建 GitHub 仓库并把当前目录内容 push 到该仓库。
# 使用说明：在 PowerShell 中切换到项目根目录（例如：
# cd 'C:\Users\Anthony_Chen1\Documents\devtools-mcp-website'），
# 然后运行：
#   .\create-and-push-repo.ps1
# 脚本会提示输入仓库名、描述与 PAT（以安全方式读取），并在本地执行创建与推送。

Param()

function Read-SecureStringToPlainText([string]$prompt) {
  Write-Host $prompt -NoNewline
  $secure = Read-Host -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

$repoName = Read-Host 'Repository name (e.g. devtools-mcp-website)'
$desc = Read-Host 'Repository description (optional)'
$privateAnswer = Read-Host 'Private repository? (y/N)'
$isPrivate = $false
if ($privateAnswer -match '^(y|Y)') { $isPrivate = $true }

# 安全读取 PAT（不会被脚本记录）
$pat = Read-SecureStringToPlainText 'Enter a GitHub Personal Access Token (scope: repo): '
if (-not $pat) { Write-Error 'No PAT provided. Aborting.'; exit 1 }

$headers = @{ Authorization = "token $pat"; 'User-Agent' = 'devtools-mcp-deployer' }
try {
  $user = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers $headers -ErrorAction Stop
} catch {
  Write-Error 'Failed to authenticate to GitHub. Check PAT and network connectivity.'
  exit 1
}

$body = @{ name = $repoName; description = $desc; private = $isPrivate } | ConvertTo-Json
try {
  $resp = Invoke-RestMethod -Uri 'https://api.github.com/user/repos' -Method Post -Headers $headers -Body $body -ContentType 'application/json' -ErrorAction Stop
  Write-Host "Repository created: $($resp.html_url)"
} catch {
  Write-Error "Failed to create repository: $($_.Exception.Message)"
  exit 1
}

# 初始化本地 git（若尚未初始化）
if (-not (Test-Path .git)) {
  git init
  git add .
  git commit -m 'Initial commit: deploy site'
}

try { git branch -M main } catch {}

$remoteUrlWithCred = "https://$($user.login):$pat@github.com/$($user.login)/$repoName.git"
try {
  if (-not (git remote)) {
    git remote add origin $remoteUrlWithCred
  } else {
    git remote set-url origin $remoteUrlWithCred
  }
} catch {
  Write-Error 'Failed to set git remote.'
  exit 1
}

try {
  git push -u origin main
  Write-Host 'Pushed to GitHub successfully.'
} catch {
  Write-Error 'Push failed. If you have 2FA enabled, consider using GitHub CLI or a temporary PAT.'
  exit 1
}

# 清理：移除远程 URL 中的凭据
try {
  git remote set-url origin "https://github.com/$($user.login)/$repoName.git"
} catch {}

Write-Host 'Done. Repository created and code pushed. You can now enable Pages if desired.'
