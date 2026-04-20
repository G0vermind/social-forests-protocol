# ============================================================
# setup-rust.ps1
# Instala Rust, configura toolchain para Soroban e faz build
# Execute: .\scripts\setup-rust.ps1
# ============================================================

Write-Host "==> Baixando e instalando rustup..." -ForegroundColor Cyan

# Baixa o instalador oficial do Rust
Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile "$env:TEMP\rustup-init.exe"

# Instala de forma não-interativa com a toolchain stable
& "$env:TEMP\rustup-init.exe" -y --default-toolchain stable --no-modify-path

# Adiciona o cargo ao PATH para esta sessão
$env:PATH += ";$env:USERPROFILE\.cargo\bin"

Write-Host "==> Adicionando target wasm32-unknown-unknown..." -ForegroundColor Cyan
rustup target add wasm32-unknown-unknown

Write-Host "==> Verificando instalação..." -ForegroundColor Cyan
rustc --version
cargo --version

Write-Host "==> Compilando contrato RWA Vault para WASM..." -ForegroundColor Green
Set-Location "$PSScriptRoot\.."
cargo build --target wasm32-unknown-unknown --release

Write-Host ""
Write-Host "✅ Build concluído! WASM em: target\wasm32-unknown-unknown\release\rwa_vault.wasm" -ForegroundColor Green
