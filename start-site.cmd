@echo off
setlocal
cd /d "%~dp0"
title Product Armor site - local dev server

echo ============================================================
echo  Product Armor Packaging site - local development server
echo ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js was not found on this machine.
  echo         Install the LTS version from https://nodejs.org and run this script again.
  echo.
  pause
  exit /b 1
)
for /f "delims=" %%v in ('node -v') do echo Node.js %%v found.

where pnpm >nul 2>&1
if errorlevel 1 (
  echo pnpm not found - installing it with npm...
  call npm install -g pnpm
  if errorlevel 1 (
    echo [ERROR] Could not install pnpm. Try running: npm install -g pnpm
    echo.
    pause
    exit /b 1
  )
)
for /f "delims=" %%v in ('pnpm -v') do echo pnpm %%v found.
echo.

rem The root package.json preinstall hook runs "sh -c ...", which plain Windows
rem cmd has no "sh" for. Git for Windows ships one - put it on PATH if present.
if exist "C:\Program Files\Git\bin\sh.exe" set "PATH=C:\Program Files\Git\bin;%PATH%"
if exist "C:\Program Files (x86)\Git\bin\sh.exe" set "PATH=C:\Program Files (x86)\Git\bin;%PATH%"

if exist "artifacts\productarmor-site\node_modules\.bin\vite.CMD" (
  echo Dependencies already installed - skipping install.
) else (
  echo Installing dependencies (the first run can take a few minutes^)...
  rem CI=1 makes pnpm non-interactive, auto-confirming the purge of a
  rem node_modules directory that was built on another OS.
  set CI=1
  call pnpm install --no-frozen-lockfile
  set CI=
  if errorlevel 1 (
    echo.
    echo [ERROR] pnpm install failed. See the messages above.
    echo.
    pause
    exit /b 1
  )
)
echo.

set PORT=5173
set BASE_PATH=/site/
set API_PORT=5000
set NODE_ENV=development

rem Stop any previous dev server still holding port 5173 (strictPort would otherwise fail)
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5173 " ^| findstr LISTENING') do (
  echo Stopping previous server on port 5173, PID %%p ...
  taskkill /F /PID %%p >nul 2>&1
)

echo Starting the Vite dev server...
echo The site will open at:  http://localhost:5173/site/
echo (Close this window or press Ctrl+C to stop the server.)
echo.

start "" /min cmd /c "timeout /t 10 /nobreak >nul & start "" http://localhost:5173/site/"

rem Run Vite directly rather than through "pnpm run dev". pnpm re-verifies the
rem workspace before running a script, which re-triggers the root preinstall hook.
cd /d "%~dp0artifacts\productarmor-site"
call "node_modules\.bin\vite.CMD" --config vite.config.ts --host 0.0.0.0

echo.
echo Dev server stopped.
pause
