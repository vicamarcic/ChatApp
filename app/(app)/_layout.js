import React from 'react';
import { View, Text } from 'react-native';
import {Stack} from "expo-router";
import HomeHeader from "@/components/HomeHeader";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
      name="home"
      options={{
        header: ()=> <HomeHeader />
      }}/>
        <Stack.Screen
            name="profile"
            options={{
                headerShown: false
            }}/>
    </Stack>
  );
};

export default Layout;