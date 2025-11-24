<#
install.ps1

Simple, ASCII-only PowerShell helper to set up a Python virtual
environment, upgrade pip, install Django, and produce a
requirements.txt file.

Usage (from project folder):
  powershell -ExecutionPolicy Bypass -File .\\install.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host 'Starting Django environment setup...' -ForegroundColor Cyan

function Resolve-Python {
    $py = Get-Command python -ErrorAction SilentlyContinue
    if ($py) { return @{Cmd = $py.Source; Args = @()} }
    $py3 = Get-Command py -ErrorAction SilentlyContinue
    if ($py3) { return @{Cmd = $py3.Source; Args = @('-3')} }
    throw 'Python 3 not found. Install Python from https://python.org and ensure it is on PATH.'
}

$resolved = Resolve-Python
$pythonCmd = $resolved.Cmd
$pythonExtraArgs = $resolved.Args

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $projectRoot

$venvPath = Join-Path $projectRoot '.venv'
$venvPython = Join-Path $venvPath 'Scripts\\python.exe'

if (-not (Test-Path $venvPath)) {
    Write-Host "Creating virtual environment at $venvPath..." -ForegroundColor Yellow
    if ($pythonExtraArgs.Count -gt 0) {
        & $pythonCmd @($pythonExtraArgs) -m venv $venvPath
    } else {
        & $pythonCmd -m venv $venvPath
    }
    Write-Host 'Virtual environment created.' -ForegroundColor Green
} else {
    Write-Host "Virtual environment already exists at $venvPath - skipping creation." -ForegroundColor DarkGreen
}

if (-not (Test-Path $venvPython)) {
    Write-Error "Could not find venv python at $venvPython. Venv creation may have failed."
    exit 1
}

Write-Host 'Upgrading pip in the virtual environment...' -ForegroundColor Yellow
& $venvPython -m pip install --upgrade pip | Out-Null

Write-Host 'Installing Django (latest) into the venv...' -ForegroundColor Yellow
& $venvPython -m pip install django | Out-Null

Write-Host 'Installed packages (top lines):' -ForegroundColor Cyan
& $venvPython -m pip freeze | Select-Object -First 20

Write-Host 'Verifying Django installation...' -ForegroundColor Yellow
try {
    $djVersion = & $venvPython -m django --version
    Write-Host "Django version: $djVersion" -ForegroundColor Green
} catch {
    Write-Error "Failed to verify Django. $_"
    exit 1
}

Write-Host 'Writing requirements.txt...' -ForegroundColor Yellow
& $venvPython -m pip freeze > requirements.txt
Write-Host 'Wrote requirements.txt' -ForegroundColor Green

Write-Host ''
Write-Host 'Setup complete. Next steps:' -ForegroundColor Cyan
Write-Host '  1) Activate the virtual environment in PowerShell:' -ForegroundColor White
Write-Host '     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force' -ForegroundColor Gray
Write-Host '     .\\.venv\\Scripts\\Activate.ps1' -ForegroundColor Gray
Write-Host '  2) Start a project (example):' -ForegroundColor White
Write-Host '     django-admin startproject mysite .' -ForegroundColor Gray
Write-Host '  3) Run the dev server:' -ForegroundColor White
Write-Host '     python manage.py runserver' -ForegroundColor Gray

Write-Host 'If you want me to run the server or create the project, tell me and I can continue.' -ForegroundColor Cyan
