# Arkose Labs React Native Example

This is an example Arkose Labs integration using React Native. As it is an example this would need to be modified before being used in a production scenario.

# Getting Started

Once you have your React Native environment setup you can run the example application by executing the following commands:

```npm install```

For iOS:
```
cd ios
pod install
cd ..
```

For Android:
```
cd android
chmod 755 gradlew
./gradlew assembleDebug
cd ..
```

Note: This example application was built for JSDK 19 and below, we recommend using that version for running this application.

## Start the application

Once setup as above you can use the following commands to run the application from the base path of the application directory.

iOS
Run the following command:
```
npm run ios
```

Android
Start an appropriate Android emulator by replacing <emulator_name> below with the name of the emulator you want to use. Or by starting an emulator in Android Studio
```
emulator -avd <emulator_name>
```
Then run the following command:
```
npm run android
```

If everything is set up correctly, you should see the app running in your Android Emulator / iOS Simulator.

If you receive errors from iOS, you may need to disable "flipper" in the iOS pod file. This can be done by 
commenting out line 43 of [ios/Podfile](ios/Podfile) and then running the following again:

```
cd ios
pod install
cd ..
```

# Configuration

This example application allows you to set your Arkose Labs provided public key and custom host name (if applicable).

These can be set in the [App.js file](App.js). 

