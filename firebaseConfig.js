import { initializeApp } from 'firebase/app';
import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore,collection} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB5xw3C57wHwK1zElv20gQJS38SqQIKX2A",
    authDomain: "fir-chat-app-b87b3.firebaseapp.com",
    projectId: "fir-chat-app-b87b3",
    storageBucket: "fir-chat-app-b87b3.firebasestorage.app",
    messagingSenderId: "785179558153",
    appId: "1:785179558153:web:87aac9516500d4ffb613d8"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app,{
    persistence:getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export const usersRef = collection(db,'users');

export const roomRef = collection(db,'rooms');