@echo off
cd /d "%~dp0"

echo Running build...
call npm run build

echo.
echo Preparing Build folder...

set SRC=%~dp0dist\win-unpacked
set DEST=%~dp0Build

if not exist "%SRC%" (
echo ERROR: win-unpacked folder not found.
pause
exit /b
)

rmdir /s /q "%DEST%" 2>nul
mkdir "%DEST%"

echo Moving files...
robocopy "%SRC%" "%DEST%" /E /MOVE

echo.
echo Done. Files moved to Build folder.
pause