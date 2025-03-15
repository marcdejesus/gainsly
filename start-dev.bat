@echo off
setlocal enabledelayedexpansion

echo Starting development servers...

:: Check if node_modules exists in both directories
if not exist "%~dp0gainsly-api\node_modules" (
  echo Installing backend dependencies...
  cd %~dp0gainsly-api && npm install
)

if not exist "%~dp0gainsly-app\node_modules" (
  echo Installing frontend dependencies...
  cd %~dp0gainsly-app && npm install
)

:: Start backend server in a new window
start "Gainsly Backend" cmd /c "cd %~dp0gainsly-api && npx nodemon --exec ts-node src/index.ts"

:: Start frontend server in a new window
start "Gainsly Frontend" cmd /c "cd %~dp0gainsly-app && npm start"

echo.
echo Development servers started in separate windows.
echo Close the windows or press Ctrl+C in each window to stop the servers.
echo.

:: Keep this window open
pause 