# 📱 React Native Mobile Application

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## 📋 Project Overview

A multifunctional React Native mobile application using **TypeScript** and **Redux Toolkit**.

The project supports:
- User authentication (Sign In, Sign Up)
- Multi-language support (English, Russian, Ukrainian)
- Image gallery viewing
- Image editing: cropping, applying filters (Grayscale, Invert), saving to device gallery
- Firebase integration
- State management via Redux Toolkit

The app is fully compatible with **Android** and **iOS**.

---

## 🚀 Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions up to the "Creating a new application" step before proceeding.

### Step 1: Install Dependencies

Run the following command in the project root:

```bash
# using npm
npm install

# OR using Yarn
yarn install

### Step 2: Start the Metro Server

# using npm
npm start

# OR using Yarn
yarn start

# for ios

cd ios && pod install && cd ..

### Step 3: Run the Application

for android

# using npm
npm run android

# OR using Yarn
yarn android

for ios

# using npm
npm run ios

# OR using Yarn
yarn ios

### ✏️ Modifying the App

After launching the app:

 - Open App.tsx in your editor and make changes.

 - For Android: Press <kbd>R</kbd> twice or open the Developer Menu (<kbd>Ctrl</kbd> + <kbd>M</kbd> or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd>) to reload.

 - For iOS: Press <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in the simulator to reload.

# 📂 Project Structure

.
├── android/                      # Android native project
├── ios/                          # iOS native project
├── src/                          # Application source code
│   ├── components/               # Reusable UI components
│   ├── constants/                # Global constants
│   ├── i18n/                     # Internationalization setup
│   │   ├── locales/              # Translation files
│   │   │   ├── en.json           # English translations
│   │   │   ├── ru.json           # Russian translations
│   │   │   └── uk.json           # Ukrainian translations
│   ├── navigation/               # App navigation (stacks)
│   │   ├── authStack/            # Authentication screens navigation
│   │   └── mainStack/            # Main screens navigation
│   ├── screens/                  # Application screens
│   │   ├── auth/                 # Authentication screens
│   │   │   ├── signIn/           # Sign In screen
│   │   │   ├── signUp/           # Sign Up screen
│   │   ├── main/                 # Main app screens
│   │   │   ├── gallery/          # Gallery screen
│   │   │   ├── ImageEditor/      # Image editor screen
│   ├── store/                    # Redux Toolkit store setup
│   ├── types/                    # Global TypeScript types
│   ├── utils/                    # Utility functions (e.g. token manager)
├── firebaseConfig.ts             # Firebase configuration
├── App.tsx                       # Application entry point
├── package.json                  # Project scripts and dependencies
├── README.md                     # Project documentation
└── other config files...

### ⚙️ Available Scripts

npm start	#Start Metro Bundler
npm run android	#Run the Android app
npm run ios	#Run the iOS app
npm run lint	#Run ESLint
npm test	#Run tests (if configured)

### 🛠️ Key Features

 - 📲 User Authentication (Sign In, Sign Up)

 - 🗺️ Stack navigation: Auth flow & Main flow

 - 🖼️ Image Gallery: Select and view images from device storage

 - ✂️ Image Editor:

   - Crop functionality

   - Grayscale filter

   - Invert colors filter

   - Save to device gallery

 - 🌐 Multi-language support: English, Russian, Ukrainian

 - 🔒 Token management using Redux Toolkit and local storage

 - 🔥 Firebase integration (authentication and storage)

 ### 🌐 Internationalization (i18n)

Supported languages:

 - 🇺🇸 English (en.json)

 - 🇷🇺 Russian (ru.json)

 - 🇺🇦 Ukrainian (uk.json)

Translations are located in:

src/i18n/locales/

Adding a New Language:

1.  Create a new JSON file in locales/.

2. Add the language to the i18n configuration in src/i18n/index.ts.

### 🔐 Required Permissions

Android

In android/app/src/main/AndroidManifest.xml:

<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />

iOS

In ios/{ProjectName}/Info.plist:

<key>NSPhotoLibraryAddUsageDescription</key>
<string>This app requires access to save images to your gallery.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>This app requires access to your photo library to select and edit images.</string>

<key>NSCameraUsageDescription</key>
<string>This app requires access to your camera to capture photos.</string>

### 🗃️ State Management

Redux Toolkit is used for global state management.

 - authSlice.ts – authentication state (login, tokens)

 - store/index.ts – Redux store setup and configuration

### 🔥 Firebase Configuration

All Firebase settings are stored in firebaseConfig.ts and use environment variables from .env.

You need to create a .env file based on .env.example and provide your Firebase credentials.

✅ TODO: Future Improvements

 - Implement global API error handling

 - Use react-native-permissions for permission management

 - Add drag-resize functionality for cropping

 - Add more image filters (e.g. Sepia, Brightness)

 - Write unit and integration tests

 - Configure EAS Build or Bitrise for automatic CI/CD

### 📚 Learn More

To learn more about React Native:

 - React Native Website

 - Getting Started Guide

 - React Native Basics

 - GitHub Repository

### 🧑‍💻 Contact

 Telegram: @justisvalya

 Email: valentyn.shvedov@gmail.com

### TechStack

 - React Native
 - TypeScript
 - Redux Toolkit
 - Firebase
