import React, {useRef, useState} from 'react';
import {View, Text, TextInput, ImageBackground, Pressable, Alert} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {useRouter} from "expo-router";
import Loading from "../components/Loading";
import {useAuth} from "@/context/authContext";
import * as ImagePicker from 'expo-image-picker';

export default function SignUp() {

    const emailRef = useRef("");
    const passwordRef = useRef("");
    const usernameRef = useRef("");
    const profileRef = useRef("");
    const [loading, setLoading] = useState(false);
    const {register} = useAuth();

    const router = useRouter();

    const handleRegister = async () => {
        if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current) {
            Alert.alert('Sign up', 'Please, enter all fields!');
            return;
        }
        try {
            setLoading(true);
            let response = await register(emailRef.current, passwordRef.current, usernameRef.current, profileRef.current);
            setLoading(false);
            if(!response.success){
                Alert.alert('Sign up', response.msg);
            }
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Allow access to your gallery to set a profile photo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            profileRef.current = uri;
            Alert.alert('Profile photo selected', 'Image successfully chosen!');
        }
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar style="light" />
            <ImageBackground
                source={require('../assets/images/8751676.jpg')}
                resizeMode="cover"
                className="flex-1 w-full h-full"
            >
                <View className="absolute inset-0 bg-black/40" />

                <View className="flex-1 justify-start px-6 pt-28">
                    <View className="mb-5">
                        <Text className="text-white text-4xl font-extrabold tracking-wide">Sign up</Text>
                    </View>

                    <View className="bg-white/95 rounded-2xl p-5">
                        <Text className="text-slate-900 text-xs font-semibold mb-2">E-mail</Text>
                        <TextInput
                            className="h-12 px-3 rounded-xl border border-slate-200 bg-white"
                            onChangeText={value => (emailRef.current = value)}
                            placeholder="you@gmail.com"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            autoComplete="email"
                            returnKeyType="next"
                        />

                        <Text className="text-slate-900 text-xs font-semibold mt-4 mb-2">Password</Text>
                        <TextInput
                            className="h-12 px-3 rounded-xl border border-slate-200 bg-white"
                            onChangeText={value => (passwordRef.current = value)}
                            placeholder="*******"
                            secureTextEntry
                            textContentType="password"
                            autoComplete="password"
                            returnKeyType="done"
                        />
                        <Text className="text-slate-900 text-xs font-semibold mb-2 mt-4">Username</Text>
                        <TextInput
                            className="h-12 px-3 rounded-xl border border-slate-200 bg-white"
                            onChangeText={value => (usernameRef.current = value)}
                            placeholder="Username"
                            autoCapitalize="none"
                            returnKeyType="next"
                        />
                        <Text className="text-slate-900 text-xs font-semibold mb-2 mt-4">Profile photo url</Text>
                        <Pressable onPress={pickImage}>
                            <View className="h-12 px-3 rounded-xl border border-slate-200 bg-white justify-center">
                                <Text className="text-slate-500">
                                    {profileRef.current ? 'Image selected ✅' : 'Tap to choose from gallery'}
                                </Text>
                            </View>
                        </Pressable>

                        <View className="mt-8 space-y-2 items-end"></View>
                        <View>
                            {loading ? (
                                <View className="flex-row justify-center">
                                    <Loading size={100} />
                                </View>
                            ) : (
                                <Pressable
                                    className="h-12 mt-5 rounded-xl items-center justify-center bg-slate-900 active:opacity-90"
                                    onPress={handleRegister}
                                >
                                    <Text className="text-white font-bold text-base">Register</Text>
                                </Pressable>
                            )}
                        </View>
                        <View className="mt-4 space-y-2 flex-row items-center justify-center">
                            <Text>Already have an account?</Text>
                            <Pressable onPress={() => router.push('signIn')}>
                                <Text className="underline text-slate-700"> Sign in</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
