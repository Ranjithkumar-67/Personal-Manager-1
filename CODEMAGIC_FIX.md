# 🔧 Codemagic Build Fix Guide

## ❌ Current Error
```
Step 3 script "Install CocoaPods" exited with status code 1
```

## ✅ Solutions

### Solution 1: Use the Correct Podfile (RECOMMENDED)

Replace your current `ios/Podfile` with the one in this folder:

```bash
# In your project
cp PersonalManagePro-NativeCode/ios/Podfile ios/Podfile
```

**Key fixes in the new Podfile:**
- ✅ Proper React Native setup
- ✅ All required dependencies declared
- ✅ Xcode 15 compatibility
- ✅ Deployment target set to iOS 13.0

---

### Solution 2: Update codemagic.yaml

Replace your codemagic.yaml with:

```yaml
workflows:
  ios-workflow:
    name: iOS Build
    instance_type: mac_mini_m2
    environment:
      node: 20.11.0
      xcode: 15.2
    scripts:
      - name: Install dependencies
        script: |
          npm ci
      
      - name: Install CocoaPods
        script: |
          cd ios
          pod repo update
          pod install --repo-update
      
      - name: Build
        script: |
          npx expo prebuild --platform ios --clean
          cd ios
          xcodebuild -workspace PersonalManagePro.xcworkspace \
            -scheme PersonalManagePro \
            -sdk iphonesimulator \
            -configuration Release \
            clean build
```

---

### Solution 3: Fix Expo Configuration

Add to your `app.json`:

```json
{
  "expo": {
    "name": "Personal Manage Pro",
    "slug": "personal-manage-pro",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.personalmanagepro",
      "deploymentTarget": "13.0",
      "supportsTablet": true
    },
    "android": {
      "package": "com.personalmanagepro",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      }
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "deploymentTarget": "13.0"
          }
        }
      ]
    ]
  }
}
```

---

### Solution 4: Clean Build in Codemagic

Add this to your workflow before pod install:

```yaml
- name: Clean Pods
  script: |
    cd ios
    rm -rf Pods Podfile.lock
    pod cache clean --all
    pod install --repo-update --verbose
```

---

## 🚀 Complete Fixed codemagic.yaml

```yaml
workflows:
  ios-build:
    name: iOS Production Build
    max_build_duration: 60
    instance_type: mac_mini_m2
    environment:
      node: 20.11.0
      xcode: 15.2
      cocoapods: default
    
    scripts:
      - name: Install npm dependencies
        script: |
          npm ci
      
      - name: Prebuild Expo
        script: |
          npx expo prebuild --platform ios --clean
      
      - name: Install CocoaPods
        script: |
          cd ios
          pod repo update
          pod install --repo-update --verbose
      
      - name: Build iOS
        script: |
          cd ios
          xcodebuild -workspace PersonalManagePro.xcworkspace \
            -scheme PersonalManagePro \
            -configuration Release \
            -destination 'generic/platform=iOS' \
            clean archive \
            CODE_SIGN_IDENTITY="" \
            CODE_SIGNING_REQUIRED=NO \
            CODE_SIGNING_ALLOWED=NO
    
    artifacts:
      - ios/build/**/*.app
    
    publishing:
      email:
        recipients:
          - ranjithrajendran2510@gmail.com
        notify:
          success: true
          failure: true
```

---

## 📝 Step-by-Step Fix

### 1. Update Project Files

```bash
# In your repository
cd PersonalManagePro

# Copy the fixed Podfile
cp ../PersonalManagePro-NativeCode/ios/Podfile ios/Podfile

# Copy the fixed codemagic.yaml
cp ../PersonalManagePro-NativeCode/codemagic.yaml codemagic.yaml

# Commit changes
git add ios/Podfile codemagic.yaml
git commit -m "Fix: Update Podfile and Codemagic config"
git push
```

### 2. Trigger New Build in Codemagic

- Go to Codemagic dashboard
- Click "Start new build"
- Select the branch
- Build should now succeed ✅

---

## 🔍 Common Issues & Fixes

### Issue 1: "No such file or directory"
**Fix:** Make sure your project has been run with `npx expo prebuild` locally first

### Issue 2: "Cannot find module"
**Fix:** Delete `node_modules` and run `npm install` again

### Issue 3: "Pod install failed"
**Fix:** 
```yaml
- name: Clean and Install Pods
  script: |
    cd ios
    rm -rf Pods Podfile.lock ~/Library/Caches/CocoaPods
    pod repo update
    pod install --verbose
```

### Issue 4: "Xcode version mismatch"
**Fix:** In codemagic.yaml, specify:
```yaml
environment:
  xcode: 15.2
```

---

## ✅ Verification Checklist

Before pushing to Codemagic:

- [ ] `ios/Podfile` matches the fixed version
- [ ] `codemagic.yaml` is updated
- [ ] `package.json` has all dependencies
- [ ] Run locally: `cd ios && pod install` (should succeed)
- [ ] Commit and push changes
- [ ] Trigger build in Codemagic

---

## 🎯 Expected Build Flow

```
1. Preparing build machine         ✅ 36s
2. Fetching app sources            ✅ 3s
3. Install dependencies            ✅ 43s
4. Install CocoaPods              ✅ 2-5min (first time)
5. Build iOS app                   ✅ 5-10min
6. Publishing                      ✅ 1s
```

---

## 📞 Still Having Issues?

Check the build logs for:

1. **Exact error message** - Look for "error:" in logs
2. **Missing dependencies** - Check if all pods are found
3. **Xcode version** - Should be 15.0+
4. **Node version** - Should be 20.x

**Common log locations:**
- CocoaPods: Look for "Installing" lines
- Xcode: Look for "xcodebuild" output
- npm: Look for "npm install" completion

---

## 🚀 Next Steps After Fix

Once build succeeds:

1. **Download IPA** from Codemagic artifacts
2. **Install on device** via TestFlight or direct install
3. **Test all features**
4. **Setup automatic builds** for every push

---

**The fixed files in this folder will resolve your Codemagic build errors!**
