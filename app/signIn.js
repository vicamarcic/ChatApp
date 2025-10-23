import React, {useRef, useState} from 'react';
import {View, Text, TextInput, ImageBackground, Pressable, Alert} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {useRouter} from "expo-router";
import Loading from "../components/Loading";
import {useAuth} from "@/context/authContext";
import LottieView from "lottie-react-native";

export default function SignIn() {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();

    const router = useRouter();

    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Sign up', 'Please, enter all fields!');
            return;
        }
        try {
            setLoading(true);
            const response = await login(emailRef.current, passwordRef.current);
            setLoading(false);
            if(!response.success){
                Alert.alert('Sign in', response.msg);
            }
        } finally {
            setLoading(false);
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
                        <Text className="text-white text-4xl font-extrabold tracking-wide">Sign in</Text>
                        <Text className="text-white/90 text-base mt-2">Welcome back👋</Text>
                    </View>

                    <View className="bg-white/95 rounded-2xl p-5">
                        <View className="items-center">
                            <LottieView
                                source={require('../assets/animations/chatbot.json')}
                                autoPlay
                                loop
                                style={{ width: 120, height: 80}}
                            />
                        </View>
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

                        <View className="mt-4 space-y-2 items-end">
                            <Pressable onPress={() => {}}>
                                <Text className="underline text-slate-700">Forgot password?</Text>
                            </Pressable>
                        </View>

                        <View>
                            {loading ? (
                                <View className="flex-row justify-center">
                                    <Loading size={100} />
                                </View>
                            ) : (
                                <Pressable
                                    className="h-12 mt-5 rounded-xl items-center justify-center bg-slate-900 active:opacity-90"
                                    onPress={handleLogin}
                                >
                                    <Text className="text-white font-bold text-base">Login</Text>
                                </Pressable>
                            )}
                        </View>

                        <View className="mt-4 space-y-2 flex-row">
                            <Text>Don't have an account yet?</Text>
                            <Pressable onPress={() => router.push('signUp')}>
                                <Text className="underline text-slate-700"> Register here</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
