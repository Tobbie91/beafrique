# 🔥 Firebase Security Rules Setup

## ❌ Error: Missing or insufficient permissions

This error means Firebase Firestore security rules need to be configured to allow blog access.

---

## ✅ Quick Fix (2 Options)

### **Option 1: Deploy Rules via Firebase CLI** (Recommended)

```bash
# Deploy the firestore rules
firebase deploy --only firestore:rules
```

**Done!** Your blog should work now.

---

### **Option 2: Update Rules in Firebase Console** (If CLI doesn't work)

1. **Go to Firebase Console:** https://console.firebase.google.com/
2. **Select your project:** "Be Afrique" (or your project name)
3. **Navigate to:** Firestore Database → Rules tab
4. **Replace all rules with:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Products collection - public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;

      match /variants/{variantId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }

    // Blog collection - public read published, admin write
    match /blogs/{blogId} {
      allow read: if resource.data.is_published == true || request.auth != null;
      allow write: if request.auth != null;
    }

    // Orders collection - admin only
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }

    // Archive designs
    match /archive_designs/{designId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

5. **Click "Publish"**
6. **Refresh your app**

---

## 🧪 Test It

After deploying rules:

1. Go to: http://localhost:5176/admin/blogs
2. Click "Create New Post"
3. Fill in details and save
4. Should work without errors! ✅

---

## 🔒 What These Rules Do

### **Products:**
✅ Anyone can READ products (for shopping)
✅ Only signed-in admins can ADD/EDIT products

### **Blogs:**
✅ Anyone can READ **published** blog posts
✅ Admins can READ **all** posts (including drafts)
✅ Only signed-in admins can CREATE/EDIT posts

### **Orders:**
✅ Only signed-in admins can view/manage orders

---

## 🚨 Quick Test Access (Development Only)

**WARNING:** Only use during development/testing!

If you need to test quickly before setting up authentication, temporarily use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ⚠️ ANYONE CAN EDIT - DEVELOPMENT ONLY!
    }
  }
}
```

**Remember to restore proper rules before going live!**

---

## 🔐 Current Authentication Setup

Your admin uses a simple PIN-based auth (from `config.ts`):
```javascript
adminPin: '1234'
```

The rules check: `request.auth != null`

This works because when you sign in to admin, Firebase sets `request.auth`.

---

## ✅ Verification

After deploying rules, you should be able to:
- ✅ Create blog posts in admin
- ✅ Edit blog posts
- ✅ View published posts at `/blog`
- ✅ Drafts only visible to admins

---

## 📝 Files Created

- ✅ `firestore.rules` - Security rules file
- ✅ `firebase.json` - Updated to reference rules
- ✅ This guide: `FIREBASE_SETUP.md`

---

## 🆘 Still Getting Errors?

1. **Check you're signed in to admin:**
   - Go to `/admin/sign-in`
   - Enter PIN: `1234`
   - Go back to `/admin/blogs`

2. **Check Firebase Console:**
   - Rules tab → Verify rules are published
   - Database tab → Verify `blogs` collection exists

3. **Clear browser cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

4. **Check browser console:**
   - Right-click → Inspect → Console tab
   - Look for specific error messages

---

## 🚀 Deploy Now!

Run this command:
```bash
firebase deploy --only firestore:rules
```

Your blog should work perfectly after this! 🎉
