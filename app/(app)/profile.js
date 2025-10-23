import React, { useRef, useState } from 'react';
import { View, Text, Image, Pressable, Modal, Alert, TextInput, ImageBackground } from 'react-native';
import { useAuth } from '@/context/authContext';
import * as ImagePicker from 'expo-image-picker';
import { db } from '@/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function Profile() {
    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const profileRef = useRef('');
    const uid = user?.uid ?? user?.userId;

    const [usernameModalOpen, setUsernameModalOpen] = useState(false);
    const usernameRef = useRef(user?.username || '');

    const [cameraOpen, setCameraOpen] = useState(false);
    const [facing, setFacing] = useState('front');
    const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();

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
            const uri = result.assets?.[0]?.uri;
            if (uri) {
                profileRef.current = uri;
                if (uid) await updateProfilePhoto(uid);
            }
        }
        setModalVisible(false);
    };

    const updateProfilePhoto = async (userId) => {
        if (!userId || !profileRef.current) return;
        await updateDoc(doc(db, 'users', String(userId)), { profileUrl: profileRef.current });
        Alert.alert('Success', 'Profile photo updated.');
    };

    const handleTakePhoto = async () => {
        setModalVisible(false);

        if (!permission || !permission.granted) {
            const p = await requestPermission();
            if (!p.granted) {
                Alert.alert('Permission denied', 'Camera access is required to take a photo.');
                return;
            }
        }
        setCameraOpen(true);
    };

    const onCapture = async () => {
        try {
            if (!cameraRef.current) return;

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.85,
                skipProcessing: true,
            });
            if (photo?.uri) {
                profileRef.current = photo.uri;
                if (uid) await updateProfilePhoto(uid);
            }
            setCameraOpen(false);
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Could not take photo.');
        }
    };

    const saveUsername = async () => {
        const v = (usernameRef.current || '').trim();
        if (!v || !uid) return;
        await updateDoc(doc(db, 'users', String(uid)), { username: v });
        setUsernameModalOpen(false);
    };

    return (
        <ImageBackground
            source={require('@/assets/images/8751676.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View className="flex-1 ">
                <View className="flex-1 items-center justify-start pt-12 px-6 gap-5">
                    <View className="size-40 rounded-full border border-neutral-200 shadow-lg overflow-hidden items-center justify-center bg-neutral-100">
                        <Image
                            source={{ uri: user?.profileUrl }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                        />
                    </View>

                    <Pressable
                        className="mt-2 px-4 py-2 rounded-full border border-neutral-300 bg-neutral-50 active:opacity-80"
                        onPress={() => setModalVisible(true)}
                    >
                        <Text className="text-neutral-700 font-semibold">Edit</Text>
                    </Pressable>

                    <View className="w-full max-w-md">
                        <View className="flex-row items-center justify-between rounded-2xl border border-neutral-300 bg-white px-4 py-3 shadow-sm">
                            <Text className="flex-1 mr-3 text-lg font-semibold text-neutral-900" numberOfLines={1}>
                                {user?.username || 'User'}
                            </Text>
                            <Pressable
                                onPress={() => setUsernameModalOpen(true)}
                                className="p-2 rounded-full border border-neutral-200 bg-neutral-50 active:opacity-80"
                                hitSlop={8}
                            >
                                <AntDesign name="idcard" size={24} color="black" />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Modal: izbor slike */}
                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View className="flex-1 items-center justify-center bg-black/40 px-6">
                        <View className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl">
                            <Text className="text-lg font-semibold text-neutral-900 mb-4">Change photo</Text>
                            <View className="gap-3">
                                <Pressable onPress={pickImage} className="w-full rounded-2xl bg-neutral-900 px-4 py-3 active:opacity-90">
                                    <Text className="text-center font-semibold text-white">Choose from gallery</Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleTakePhoto}
                                    className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3 active:opacity-90"
                                >
                                    <Text className="text-center font-semibold text-neutral-800">Take photo</Text>
                                </Pressable>
                                <Pressable onPress={() => setModalVisible(false)} className="w-full rounded-2xl px-4 py-3 active:opacity-80">
                                    <Text className="text-center font-semibold text-neutral-500">Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Modal: kamera (CameraView) */}
                <Modal
                    visible={cameraOpen}
                    transparent={false}
                    animationType="slide"
                    onRequestClose={() => setCameraOpen(false)}
                >
                    <View style={{ flex: 1, backgroundColor: 'black' }}>
                        <CameraView
                            ref={cameraRef}
                            style={{ flex: 1 }}
                            facing={facing}
                            ratio="16:9"
                        />
                        <View className="absolute bottom-8 left-0 right-0 px-8 flex-row justify-between items-center">
                            <Pressable
                                onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
                                className="px-4 py-3 rounded-full bg-white/20"
                            >
                                <Text className="text-white font-semibold">Flip</Text>
                            </Pressable>
                            <Pressable
                                onPress={onCapture}
                                className="size-16 rounded-full bg-white self-center"
                            />
                            <Pressable
                                onPress={() => setCameraOpen(false)}
                                className="px-4 py-3 rounded-full bg-white/20"
                            >
                                <Text className="text-white font-semibold">Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {/* Modal: promena username-a */}
                <Modal
                    visible={usernameModalOpen}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setUsernameModalOpen(false)}
                >
                    <View className="flex-1 items-center justify-center bg-black/40 px-6">
                        <View className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl">
                            <Text className="text-lg font-semibold text-neutral-900 mb-4">Change username</Text>
                            <TextInput
                                defaultValue={user?.username || ''}
                                onChangeText={(t) => (usernameRef.current = t)}
                                placeholder="Enter new username"
                                className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900"
                                autoCapitalize="none"
                                autoCorrect={false}
                                maxLength={30}
                            />
                            <View className="mt-4 flex-row justify-end gap-3">
                                <Pressable onPress={() => setUsernameModalOpen(false)} className="px-4 py-3 rounded-2xl active:opacity-80">
                                    <Text className="font-semibold text-neutral-500">Cancel</Text>
                                </Pressable>
                                <Pressable onPress={saveUsername} className="px-4 py-3 rounded-2xl bg-neutral-900 active:opacity-90">
                                    <Text className="font-semibold text-white">Save</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
}
