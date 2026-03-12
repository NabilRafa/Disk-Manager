@echo off
setlocal

:: ─────────────────────────────────────────
:: CONFIG
:: ─────────────────────────────────────────
set RAR_EXE="C:\Program Files\WinRAR\Rar.exe"
set SOURCE_FOLDER=Build
set OUTPUT_ARCHIVE=Build.rar
set MIN_VERSION=7.20

:: ─────────────────────────────────────────
:: CHECK WinRAR
:: ─────────────────────────────────────────
if not exist %RAR_EXE% (
echo [ERROR] WinRAR was not found at %RAR_EXE%.
echo Please install WinRAR or update the RAR_EXE path in this script.
pause
exit /b 1
)

:: ─────────────────────────────────────────
:: CHECK WinRAR VERSION
:: ─────────────────────────────────────────
for /f "tokens=3" %%v in ('%RAR_EXE% ^| findstr /i "RAR"') do (
set RAR_VERSION=%%v
goto :version_found
)

:version_found
if not defined RAR_VERSION (
echo [WARNING] Unable to detect WinRAR version.
echo If archiving fails, please update WinRAR to version 7.20 or newer.
)

echo Detected WinRAR version: %RAR_VERSION%

:: ─────────────────────────────────────────
:: CHECK SOURCE FOLDER
:: ─────────────────────────────────────────
if not exist "%SOURCE_FOLDER%" (
echo [ERROR] Folder "%SOURCE_FOLDER%" was not found.
echo Make sure this script is executed in the same directory as the Build folder.
pause
exit /b 1
)

:: ─────────────────────────────────────────
:: ARCHIVE
:: Flags:
::   a         = add to archive
::   -m5       = compression method Best
::   -md1024   = dictionary size 1024 KB
::   -s        = create solid archive
::   -k        = lock archive
::   -ep1      = exclude base folder from path
::   -r        = recursive
:: ─────────────────────────────────────────
echo.
echo [INFO] Starting archive process for "%SOURCE_FOLDER%"...
echo.

%RAR_EXE% a -m5 -md1024 -s -k -ep1 -r "%OUTPUT_ARCHIVE%" "%SOURCE_FOLDER%"

if %errorlevel% == 0 (
echo.
echo [OK] Archive successfully created: %OUTPUT_ARCHIVE%
) else (
echo.
echo [ERROR] Archiving failed. Error code: %errorlevel%
echo Please update WinRAR to version 7.20 or newer and try again.
)

pause
endlocal
