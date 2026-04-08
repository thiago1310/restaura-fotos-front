$ErrorActionPreference = 'Stop'

$sourceDir = Join-Path $PSScriptRoot '..\\dist'
$sourceDir = [System.IO.Path]::GetFullPath($sourceDir)
$targetDir = 'C:\Users\Administrador\Documents\container\nginx\nginx\nginx-html\restauraphoto.com.br'

if (-not (Test-Path -LiteralPath $sourceDir)) {
    throw "Pasta de build nao encontrada: $sourceDir"
}

if (-not (Test-Path -LiteralPath $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

$resolvedTarget = [System.IO.Path]::GetFullPath($targetDir)
if ($resolvedTarget -ne $targetDir) {
    throw "Falha ao resolver a pasta de destino: $targetDir"
}

Get-ChildItem -LiteralPath $targetDir -Force | Remove-Item -Recurse -Force
Copy-Item -Path (Join-Path $sourceDir '*') -Destination $targetDir -Recurse -Force

Write-Host "Build copiado para $targetDir"
