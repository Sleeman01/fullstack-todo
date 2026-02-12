# Publish "Get it done" on Google Play Store

This guide gets your todo app from a web project to a live Android app on the Play Store.

---

## Overview

1. **Backend** runs in the cloud (so the app can reach it from any phone).
2. **Frontend** is wrapped with **Capacitor** into an Android app.
3. You build a signed **Android App Bundle (AAB)** and upload it to **Google Play Console**.

---

## Prerequisites

- **Node.js** and **npm** (you already have these).
- **Android Studio** ([download](https://developer.android.com/studio)) – needed to build the app and create a signing key.
- **Google Play Developer account** – one-time **$25** fee at [play.google.com/console](https://play.google.com/console).

---

## Step 1: Install Capacitor and add Android

In a terminal, from your project folder:

```bash
cd fullstack-todo/frontend
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Get it done" "com.getitdone.todo" --web-dir=dist
npx cap add android
```

If `cap init` says the app already exists (because we added `capacitor.config.ts`), that’s fine. Just run:

```bash
npx cap add android
```

---

## Step 2: Deploy your backend to the cloud

The app on a phone cannot use `http://localhost:3001`. You need a real URL.

**Options:**

- **Railway** – [railway.app](https://railway.app) – easy deploy from GitHub, free tier.
- **Render** – [render.com](https://render.com) – free tier for web services.
- **Fly.io** – [fly.io](https://fly.io) – free tier.

**What to do:**

1. Put your `fullstack-todo` repo on **GitHub** (if you haven’t already).
2. Create a new project on Railway/Render/Fly and connect the repo.
3. Set the **root** or **start command** to the **backend** (e.g. `cd backend && npm install && npm start`), and set the port they give you (often `PORT` env var).
4. After deploy, you get a URL like `https://your-app-name.up.railway.app`.  
   **This is your API URL.**

---

## Step 3: Point the app to your backend

In `frontend`, create a file named **`.env`** (same folder as `package.json`):

```env
VITE_API_URL=https://your-actual-backend-url.com
```

Replace with the URL from Step 2 (no slash at the end).  
When you run `npm run build`, the app will use this URL instead of localhost.

---

## Step 4: Build the web app and sync to Android

From `frontend`:

```bash
npm run build
npx cap sync
```

This builds the React app into `dist/` and copies it into the Android project.

---

## Step 5: Open in Android Studio and run on a device/emulator

```bash
npx cap open android
```

Android Studio will open.

- Connect a physical Android phone (with USB debugging enabled) or start an **Android Virtual Device (AVD)**.
- Click the green **Run** button to install and run the app.  
- **If "Module not specified"**: In the run config dropdown choose **"Install Debug (Gradle)"** instead, then Run. Or double-click `frontend\android\run-app.bat` to build and install without using the Run button.

You should see “Get it done” and your tasks (if the backend is deployed and `.env` has the correct `VITE_API_URL`).

---

## Step 6: Build a signed App Bundle (AAB) for Play Store

In Android Studio:

1. **Build → Generate Signed Bundle / APK…**
2. Choose **Android App Bundle** → Next.
3. Create or choose a **keystore** (store the file and passwords somewhere safe – you need them for every future update).
4. Pick **release** build type, then **Finish**.

You get an **`.aab`** file (e.g. in `frontend/android/app/release/`).

---

## Step 7: Create the app in Google Play Console

1. Go to [play.google.com/console](https://play.google.com/console) and pay the one-time **$25** if you haven’t already.
2. Click **Create app**.
3. Fill in:
   - **App name:** Get it done  
   - **Default language**  
   - **App or game:** App  
   - **Free or paid:** Free (or Paid if you want)
4. Accept the declarations and create the app.

---

## Step 8: Fill in the store listing and upload the AAB

In Play Console, for your app:

1. **Dashboard → Set up your app** (or **Release → Production**).
2. **Main store listing:**
   - Short description (max 80 characters).
   - Full description (what the app does, features).
   - **Graphics:**  
     - App icon: **512×512 px** PNG.  
     - Feature graphic: **1024×500 px** (optional but recommended).  
   - Screenshots: at least 2 phone screenshots (e.g. from the emulator or your phone).
3. **Release → Production → Create new release:**
   - Upload the **.aab** file you built in Step 6.
   - Add release notes (e.g. “Initial release”).
4. Complete **Content rating**, **Privacy policy** (you need a URL to a simple page saying what data you collect – e.g. “We store your tasks on our servers”), and **Target audience**.
5. Submit for review.

Google usually reviews within a few days. Once approved, your app will be live on the Play Store.

---

## Quick reference: commands

| What you’re doing              | Command (from `frontend`)     |
|-------------------------------|-------------------------------|
| Build web app                 | `npm run build`               |
| Copy build into Android project | `npx cap sync`              |
| Open Android project          | `npx cap open android`        |
| Run on device/emulator        | Green Run in Android Studio   |

After changing the React app, always run `npm run build` then `npx cap sync` before running or building again in Android Studio.

---

## Resuming after moving the project (e.g. out of a Hebrew-named folder)

If the process stopped because the project was in a path with non-ASCII characters (e.g. Hebrew):

1. **You've already moved the project** to a path like `Documents\cursor\fullstack-todo` (all ASCII). That's correct.

2. **Clean and re-sync** from the new location (from the project root, e.g. `fullstack-todo`):
   ```bash
   cd frontend
   npm run build
   npx cap sync
   ```

3. **Optional: clean the Android build** so nothing is cached from the old path:
   - Delete the folder `frontend\android\build` if it exists, or in Android Studio: **Build → Clean Project** after opening the project.

4. **Open the Android project from the new path** (from project root: `cd frontend` first, then):
   ```bash
   npx cap open android
   ```
   Android Studio will use the current folder; no path in the project files is hardcoded to the old location.

5. **Continue from where you stopped** using the steps above (e.g. Step 5 to run on device, Step 6 to build the signed AAB, Step 7–8 for Play Console).

---

## Troubleshooting

- **App shows blank screen:**  
  Check that `VITE_API_URL` in `.env` is correct and that the backend is deployed and reachable (try the API URL in a browser).

- **CORS errors:**  
  Your backend must allow requests from `https://` and from the Android app. In `backend/index.js`, `cors()` is already used; if you add a custom origin list later, include your backend domain and `capacitor://localhost` for Android.

- **“Cleartext traffic” on Android:**  
  Use **HTTPS** for your API URL. Avoid `http://` in production.

If you tell me which step you’re on (e.g. “I’m at Step 1” or “I use Railway”), I can give you exact clicks or commands for that part.
