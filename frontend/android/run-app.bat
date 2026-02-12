@echo off
REM Run "Get it done" on a connected device or emulator (no Android Studio Run button needed)
cd /d "%~dp0"
echo Building and installing app...
call gradlew.bat installDebug
if %ERRORLEVEL% equ 0 (
    echo.
    echo Done. Open "Get it done" on your device or emulator.
) else (
    echo.
    echo Build failed. Check errors above.
    pause
)
