@echo off
setlocal
cd /d "%~dp0"
title Product Armor site - second dev server (port 5174)

echo ============================================================
echo  Product Armor Packaging site - SECOND dev server
echo  Port 5174  (the main launcher uses 5173)
echo ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js was not found on this machine.
  echo         Install the LTS version from https://nodejs.org and try again.
  echo.
  pause
  exit /b 1
)

set "SITE=artifacts\productarmor-site"

if not exist "%SITE%\node_modules\.bin\vite.CMD" (
  echo [ERROR] Vite is not installed in %SITE%.
  echo         Run start-site.cmd first to install the dependencies.
  echo.
  pause
  exit /b 1
)

set PORT=5174
set BASE_PATH=/site/
set API_PORT=5000
set NODE_ENV=development

rem Free port 5174 if a previous second server is still holding it
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5174 " ^| findstr LISTENING') do (
  echo Stopping previous server on port 5174, PID %%p ...
  taskkill /F /PID %%p >nul 2>&1
)

echo Starting a second Vite dev server...
echo This one runs at:  http://localhost:5174/site/
echo The main server on http://localhost:5173/site/ is left untouched.
echo (Close this window or press Ctrl+C to stop THIS server only.)
echo.

rem Run Vite directly rather than through "pnpm run dev". pnpm re-verifies the
rem workspace before running a script, which triggers the root preinstall hook -
rem and that hook needs Unix "sh", which plain Windows cmd does not have.
cd /d "%~dp0%SITE%"
call "node_modules\.bin\vite.CMD" --config vite.config.ts --host 0.0.0.0

echo.
echo Second dev server stopped.
pause
