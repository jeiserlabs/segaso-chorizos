@echo off
chcp 65001 >nul
title Segaso Chorizos — Plataforma Web y Gestion
cd /d "%~dp0"

echo ============================================================
echo   Segaso Chorizos de Tradicion (Envigado)
echo   Plataforma E-Commerce B2C y Back Office Administrativo
echo ============================================================
echo.

if not exist .env (
    echo [CONFIG] Inicializando archivo .env local desde plantilla...
    copy .env.example .env >nul 2>&1
)

node -v >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js detectado.
    echo [OK] Abriendo navegador en http://localhost:3000 ...
    echo [OK] Panel Back Office: http://localhost:3000/chorizos-segaso/admin
    start "" http://localhost:3000
    node --env-file=.env server.js
    goto :end
)

echo [OK] Abriendo Segaso directamente en el navegador (Modo Vista Previa)...
start "" "%~dp0index.html"

:end
pause
