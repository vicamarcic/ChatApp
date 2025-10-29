✨ Features
- 🔐 **Authentication** — Firebase Email/Password
- 💬 **Real-time chat** — messages stored in Firestore
- 📱 **Native look & feel** — Expo, React Native components, Tailwind/NativeWind styling
- 🧭 **File-based navigation** — `app/` directory (Expo Router-style layout)

  🛠 Tech Stack
- **React Native** with **Expo**
- **Firebase**: Auth, Firestore (NoSQL), Storage
- **NativeWind/Tailwind** for styling

  Getting Started

 1) Clone
    git clone https://github.com/vicamarcic/ChatApp.git
    cd ChatApp

 2) Install dependencies
    # choose one package manager
    npm install    # or: yarn / pnpm install
 
 3)Install Expo Go application  
    
 4) Run (development)
    npx expo start

    Press a for Android emulator, i for iOS simulator (macOS), or w for Web.

    Or open Expo Go on your phone and scan the QR code (same Wi-Fi as your computer).

    Typical Expo scripts you can also use:

    npm run start   # alias for: npx expo start
    npm run android # dev build on Android
    npm run ios     # dev build on iOS (macOS)
    npm run web     # run in the browser

🗂 Project Structure
    app/            # screens and routes (file-based)
    assets/         # images, icons, etc.
    components/     # reusable UI components
    constants/      # app-wide constants (colors, sizes, etc.)
    context/        # providers (e.g., auth), React context
    firebaseConfig.js
    tailwind.config.js
    metro.config.js

  
