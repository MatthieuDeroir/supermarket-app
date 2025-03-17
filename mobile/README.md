

# Getting Started

## Requirements for Development of the Application

For the development of the application, you will need to have the following installed on your machine:

### Java Development Kit (JDK)
- **Version:** 17.0.2

### Build Tools
- **Build Tools Version:** 34.0.0

### Android SDK
- **Minimum SDK Version:** 24
- **Compile SDK Version:** 34
- **Target SDK Version:** 34

### Native Development Kit (NDK)
- **NDK Version:** 26.1.10909125

### Kotlin
- **Kotlin Version:** 1.9.24

Make sure your development environment is configured with these versions to ensure compatibility and optimal performance of the application.



## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Step 4: Build your App

### For Android

When you want to export export this app to apk, use this command :

```bash
npm run android-release
```

The APK file can be found in ./android/app/outputs/apk/release/

## Congratulations! :tada:





Executer les logs ->
npx react-native log-android

connecter pc et phone ->
adb reverse tcp:4000 tcp:4000 