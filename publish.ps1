#!/bin/pwsh
[Cmdletbinding()]param($msg)
if (-not $msg) {$msg = Get-Date -f 'YYYY-MM-dd'}
$ErrorActionPreference = "Stop"
npm run build
$dest = "../../../cawoodm.github.io/mineblast"
Remove-Item -Recurse -Force $dest/* 
Copy-Item -Recurse -Force dist/* $dest
Push-Location $dest
git add .
git commit -a -m $msg
git push
Pop-Location