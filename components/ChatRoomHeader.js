import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Stack} from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import {Image} from "expo-image";
import Ionicons from '@expo/vector-icons/Ionicons';

const ChatRoomHeader = ({user,router}) => {
  return (
    <Stack.Screen
    options={{
        title: '',
        headerShadowVisible: false,
        headerLeft: ()=>(
        <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={()=>router.back()}>
                <Entypo name="back" size={24} color="black" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
                <Image
                source = {user?.profileUrl}
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.08)',
                    backgroundColor: '#f3f4f6',
                }}
                />
                <Text className="text-neutral-900 font-semibold text-base leading-5">{user?.username}</Text>
            </View>
        </View>
        ),
        headerRight: ()=>(
            <View className="flex-row items-center gap-8">
                <Ionicons name="call" size={24} color="black" />
                <Ionicons name="videocam" size={24} color="black" />
            </View>
        )
    }}
    />
  );
};

export default ChatRoomHeader;