@echo off
REM Stop Gradle and remove locked build/cache folders, then build and install.
REM Close Android Studio before running this if you get "Cannot lock" or "Unable to delete" errors.
cd /d "%~dp0"

echo Stopping Gradle daemons...
call gradlew.bat --stop 2>nul
timeout /t 2 /nobreak >nul

echo Removing build caches (may fix "Unable to delete" or "Cannot lock")...
if exist ".gradle" rd /s /q ".gradle" 2>nul
if exist "app\build" rd /s /q "app\build" 2>nul
if exist "build" rd /s /q "build" 2>nul
if exist "capacitor-cordova-android-plugins\build" (
    rd /s /q "capacitor-cordova-android-plugins\build" 2>nul
    if exist "capacitor-cordova-android-plugins\build" (
        echo.
        echo ERROR: Could not delete capacitor-cordova-android-plugins\build - it is locked.
        echo Pause OneDrive sync, close any file explorers open to this folder, then run this script again.
        pause
        exit /b 1
    )
)

set CAP_BUILD=..\node_modules\@capacitor\android\capacitor\build
if exist "%CAP_BUILD%" (
    rd /s /q "%CAP_BUILD%" 2>nul
    if exist "%CAP_BUILD%" (
        echo Note: Some files in node_modules\@capacitor\android\capacitor\build may still be locked.
        echo Close Android Studio and any other Gradle/Java processes, then run this script again.
    ) else (
        echo Removed Capacitor build folder.
    )
)

echo.
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
