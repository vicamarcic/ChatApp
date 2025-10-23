import React, {useEffect} from 'react';
import {Slot, useRouter, useSegments} from 'expo-router';
import "../global.css";
import {AuthProvider, useAuth} from "@/context/authContext";
import { PaperProvider } from 'react-native-paper';

const MainLayout = () => {
    const{isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(()=>{
        if(typeof isAuthenticated == 'undefined') return;
        const inApp = segments[0] === '(app)';
        if(!inApp && isAuthenticated) {
            router.replace('home');
        }else if(isAuthenticated===false){
            router.replace('signIn');
        }
    },[isAuthenticated]);

    return <Slot/>
}

export default function RootLayout (){
  return (
      <PaperProvider>
         <AuthProvider>
             <MainLayout/>
         </AuthProvider>
      </PaperProvider>
  );
};
