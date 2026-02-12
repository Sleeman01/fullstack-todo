# How to run "Get it done" on a device or emulator

You do **not** need the "Module" dropdown in Android Studio. Use one of these:

---

## 1. Gradle run configuration (in Android Studio)

1. Open this **android** folder in Android Studio (`frontend\android`).
2. In the toolbar, open the **run configuration** dropdown (next to the green Run button).
3. Select **"Install Debug (Gradle)"**.
4. Connect a device (USB debugging on) or start an emulator.
5. Click the green **Run** button.

This runs the Gradle task `:app:installDebug` and installs the app. No module selection needed.

---

## 2. One-click script (no Android Studio)

1. Connect a device (USB debugging on) or start an emulator.
2. Double-click **`run-app.bat`** in this folder (`frontend\android\run-app.bat`).

Or from a terminal:

```bat
cd frontend\android
run-app.bat
```

The app will build and install. Open "Get it done" on the device.

---

## 3. Manual Gradle command

```bat
cd frontend\android
gradlew.bat installDebug
```

---

**Why "Module not specified"?**  
The Android App run configuration in Android Studio requires a module. This project’s Gradle sync sometimes doesn’t register the app module in the IDE. Using **"Install Debug (Gradle)"** or **run-app.bat** bypasses that and always works.

---

## "Cannot lock file hash cache" (file already locked)

Gradle's cache is locked by another process (e.g. Android Studio and terminal both running, or OneDrive syncing `.gradle`).

**Fix:**  
1. Close Android Studio.  
2. In a terminal, from `frontend\android`: run `gradlew.bat --stop`.  
3. Delete the folder `frontend\android\.gradle` (Gradle will recreate it).  
4. Run again (`run-app.bat` or open Android Studio and run).

**If the project is in OneDrive:** Pause OneDrive sync while building, or work from a folder outside OneDrive to avoid file locking.
