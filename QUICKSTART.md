# ⚡ Quick Start - 5 Minutes to Running App

## 1️⃣ Install Prerequisites (One-time setup)

```bash
# Install Node.js (if not installed)
brew install node@20

# Install CocoaPods
sudo gem install cocoapods
```

## 2️⃣ Setup Project

```bash
cd PersonalManagePro

# Install dependencies
npm install

# Install iOS pods
cd ios && pod install && cd ..
```

## 3️⃣ Run App

```bash
# Terminal 1: Start Metro
npm start

# Terminal 2: Launch iOS
npm run ios
```

## ✅ Done!

The app will open in iOS Simulator.

**Login:** Use any username/password

---

## 🎯 Test Features

1. **Dashboard** → See welcome & empty state
2. **Money** → Tap + → Add expense
3. **Tasks** → Create a task
4. **Notes** → Write a note
5. **Dashboard** → See live updates!

---

## 🚨 Troubleshooting

**Metro won't start?**
```bash
npm start -- --reset-cache
```

**Build fails?**
```bash
cd ios && pod install && cd ..
npm run ios
```

**Simulator not found?**
- Open Xcode
- Download iOS Simulator from Preferences → Components

---

## 📚 Full Documentation

- `BUILD_GUIDE.md` - Complete build instructions
- `README.md` - Project overview
- `FEATURES.md` - UI/UX details
- `SETUP.md` - Detailed setup

---

**Enjoy your premium iOS app! 🚀**
