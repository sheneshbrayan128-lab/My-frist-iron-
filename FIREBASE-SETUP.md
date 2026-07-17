# Setting Up the Product Database (Firebase)

This connects your admin panel (`admin.html`) to a free database, so you can add, edit, and delete products from a browser — and every department page updates automatically.

**Cost:** Free (Firebase's free "Spark" plan covers a small shop's traffic easily).

## Step 1 — Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Sign in with any Google account
3. Click **"Add project"**
4. Name it (e.g. "NMS Website"), click through the setup (you can disable Google Analytics — not needed)
5. Wait for it to finish creating

## Step 2 — Create a Web App

1. On your new project's dashboard, click the **`</>`** (web) icon
2. Give it a nickname (e.g. "nms-site")
3. **Don't** check "Firebase Hosting" — you're already using GitHub Pages
4. Click **"Register app"**
5. You'll see a code block that looks like this:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "nms-website-xxxxx.firebaseapp.com",
     projectId: "nms-website-xxxxx",
     storageBucket: "nms-website-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
6. Copy just that object

## Step 3 — Paste it into your site

1. Open `firebase-config.js` (in this folder, or on GitHub)
2. Replace the placeholder values with what you copied
3. Save / commit

## Step 4 — Turn on the database

1. In the Firebase Console left sidebar, click **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** for now (easiest to get running — see security note below)
4. Pick a location close to Sri Lanka (e.g. `asia-south1`)
5. Click **Enable**

## Step 5 — Turn on login (so only you can edit)

1. In the sidebar, click **Build → Authentication**
2. Click **"Get started"**
3. Click **"Email/Password"** in the provider list, toggle it **on**, save
4. Go to the **Users** tab → **"Add user"**
5. Enter the email and password you (or akisha321) want to log into `admin.html` with

## Step 6 — Try it

1. Upload all files (including the updated `firebase-config.js`) to GitHub
2. Open `your-site-url/admin.html`
3. Log in with the email/password from Step 5
4. Add a product, then check the matching department page — it should appear there instead of the default catalog

## Important security note

"Test mode" (Step 4) leaves the database open to anyone for 30 days, then locks it. Before that happens, go to **Firestore Database → Rules** and replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

This lets anyone *view* products (needed for your site to work) but only *logged-in* users (you, via admin.html) can add/edit/delete.

## Adding images

There's no file upload in the admin panel — instead, paste an **image URL**. Easiest free options:
- Upload to [imgur.com](https://imgur.com) (no account needed) → right-click the image → "Copy image address" → paste that into the Image URL field
- Or use a Google Photos / Facebook shared image link

If you leave the Image URL blank, the product card will just show without a photo.
