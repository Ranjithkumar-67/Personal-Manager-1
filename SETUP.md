# 🚀 Setup Instructions

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. iOS Setup
```bash
cd ios
pod install
cd ..
```

### 3. Run the App
```bash
# Start Metro
npm start

# In another terminal
npm run ios
```

---

## Detailed Setup

### Prerequisites
- macOS (for iOS development)
- Xcode 15+ installed
- Node.js 20+
- CocoaPods installed

### iOS Configuration

1. **Install Xcode Command Line Tools**
```bash
xcode-select --install
```

2. **Install CocoaPods**
```bash
sudo gem install cocoapods
```

3. **Install iOS Pods**
```bash
cd ios && pod install
```

4. **Open in Xcode** (optional for customization)
```bash
open ios/PersonalManagePro.xcworkspace
```

---

## Run Commands

### Development
```bash
npm start          # Start Metro bundler
npm run ios        # Run on iOS simulator
npm run ios -- --device  # Run on physical device
```

### Production Build
```bash
npm run build:ios:prod
```

---

## Troubleshooting

### Metro won't start
```bash
npm start -- --reset-cache
```

### Pods issue
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Clear all cache
```bash
watchman watch-del-all
rm -rf node_modules
npm install
```

---

## Login Credentials (Development)

For testing, use any User ID and Password.
The app will auto-authenticate on first login.

---

## Next Steps

1. Customize theme in `app/theme/index.ts`
2. Add your expense categories
3. Enable Face ID in iOS Settings > Face ID & Passcode
4. Explore all 7 tabs: Dashboard, Money, Tasks, Notes, Goals, Habits, Settings

---

**Enjoy your premium iOS app! 🎉**
