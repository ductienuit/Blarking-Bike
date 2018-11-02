# Location Notifier

[Location Notifier](https://github.com/manhquynh-github/React-Native-Project) is a simple cross-platform mobile app that utilizes [React Native](https://facebook.github.io/react-native/) technology. Our app aims to provide the ability of notifying a user whenever he/she is about to reach a set destination. Furthermore, this app supports organizing a favorite list and other related settings where you can control the reminder.

This is useful for those who are students or people who travel by bus a lot, which, in some cases, they don't know if they have reached the destination or sometimes oversleep on the bus. Moreover, our app also assists those who are looking for nearby gas station or local ATM.
![Demo](https://media.giphy.com/media/HzMfJIkTZgx8s/giphy.gif)

Download CH Play [here!](https://vietpano.com/)

# Table of Content

1. [Getting Started](#getting-started)
2. [Components](#components)
3. [Addtional tools](#additional-tools)
4. [Documentation](#documentation)
5. [Appstore](#appstore)

# Getting Started

To get directly to released app, please go to [Appstore](#appstore).

Below is the guidelines to start the app in development mode.

## Set up environment

1. [NodeJS](https://nodejs.org/en/)

Use latest version

2. [Yarn](https://yarnpkg.com/en/) package

You can download and use the installer from their [homepage](https://yarnpkg.com/en/docs/install#windows-stable) or install via npm.

```sh
npm install -g yarn
```

Then add this to PATH environment:

```
%USERPROFILE%\AppData\Local\Yarn\bin
```

3. [Expo](https://expo.io/) client

```sh
yarn global add expo-cli
```

## Clone project & install packages

```sh
git clone https://github.com/manhquynh-github/React-Native-Project.git
cd React-Native-Project
yarn install
```

You have successfully set up [Location Notifier](https://github.com/manhquynh-github/React-Native-Project) in development mode. The app is now all ready to run on any mobile devices/emulators.

## Setup with browser expo (**_outdated_**)

_This part is outdated, update coming soon._

You can run the following command to create the boilerplate.

Go to app location

```sh
cd React-Native-Project
```

For Android run

```sh
expo start
```

Connect your android device or turn on emulator

```sh
Choose Local in CONNECTION Menu
Click Run on Android device/ emulator
```

Refer [expo-project](https://facebook.github.io/react-native/docs/getting-started.html) page for additional information

# Additional Tools

You can use any text editor to edit source code and any command line program to start the project. These are the recommended development tools.

**IDE**

- [Visual Studio Code](https://code.visualstudio.com/)

**VSCode extensions**

- [Auto Import](#https://marketplace.visualstudio.com/items?itemName=steoates.autoimport) Automatically finds, parses and provides code actions and code completion for all available imports. Works with Typescript and TSX
- [Auto Import - ES6, TS, JSX, TSX](#https://marketplace.visualstudio.com/items?itemName=NuclleaR.vscode-extension-auto-import) Automatically finds, parses and provides code actions and code completion for all available imports. Works with JavaScript and TypeScript.
- [JavaScript (ES6) code snippets](#https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets) Code snippets for JavaScript in ES6 syntax
- [Node.js Modules Intellisense](#https://marketplace.visualstudio.com/items?itemName=leizongmin.node-module-intellisense) Autocompletes Node.js modules in import statements
- [Path Intellisense](#https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense) Visual Studio Code plugin that autocompletes filenames
- [Prettier - Code formatter](#https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) VS Code package to format your JavaScript / TypeScript / CSS using Prettier.
- [React Native Tools](#https://marketplace.visualstudio.com/items?itemName=vsmobile.vscode-react-native) This extension provides a development environment for React Native projects. Using this extension, you can debug your code and quickly run react-native commands from the command palette.
- [Version Lens](#https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens) Shows the latest version for each package using code lens

# Components

> [Expo](https://docs.expo.io) apps are React Native apps which contain the Expo SDK. The SDK is a native-and-JS library which provides access to the device's system functionality (things like the camera, contacts, local storage, and other hardware). That means you don't need to use Xcode or Android Studio, or write any native code, and it also makes your pure-JS project very portable because it can run in any native environment containing the Expo SDK.

> [Native Base](https://nativebase.io/) is made from effective building blocks referred to as components. The Components are constructed in pure [React Native](https://github.com/facebook/react-native) platform along with some JavaScript functionality with rich set of customisable properties. These components allow you to quickly build the perfect interface.

> [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage.html#asyncstorage) is a simple, unencrypted, asynchronous, persistent, key-value storage system that is global to the app. It should be used instead of LocalStorage.

> [MapView](https://docs.expo.io/versions/latest/sdk/map-view) A Map component that uses Apple Maps or Google Maps on iOS and Google Maps on Android. Expo uses react-native-maps at react-community/react-native-maps. No setup required for use within the Expo app, or within a standalone app for iOS. See below for instructions on how to configure for deployment as a standalone app on Android.

> [Redux](https://redux.js.org/) Redux is a predictable state container for JavaScript apps.
> (Not to be confused with a WordPress framework – Redux Framework.)

# Documentation

- [Native Base](https://docs.nativebase.io/).
- Redux ([eng](<(https://medium.com/backticks-tildes/setting-up-a-redux-project-with-create-react-app-e363ab2329b8)>)/[vie](https://viblo.asia/p/chuong-2-ung-dung-redux-dau-tien-cua-ban-07LKXA8JZV4))
- PropTypes ([eng](https://reactjs.org/docs/typechecking-with-proptypes.html)/[vie](<(https://viblo.asia/p/react-proptypes-khai-bao-kieu-du-lieu-cho-component-naQZR1aPKvx)>))
- [FlatList](https://medium.com/react-native-development/how-to-use-the-flatlist-component-react-native-basics-92c482816fe6)
- [Expo SDK](https://docs.expo.io/versions/latest/sdk)

# Appstore

[https://vietpano.com](https://vietpano.com)
