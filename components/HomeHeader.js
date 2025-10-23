import React,{useState} from 'react';
import { View, Text, Platform,Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {useAuth} from "@/context/authContext";
import { Menu,Divider} from 'react-native-paper';
import {CustomMenuItem} from "@/components/CustomMenuItem";
import {useRouter} from "expo-router";

const ios = Platform.OS === 'ios';
const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const  HomeHeader =() =>{
    const { top } = useSafeAreaInsets();
    const {user} = useAuth();
    const [open, setOpen] = useState(false);

    const openMenu = () => setOpen(true);
    const closeMenu = () => setOpen(false);
    const toggleMenu = () => setOpen(v => !v);

    const {logout} = useAuth();

    const router = useRouter();

    const handleProfile = () => {
        closeMenu();
        setTimeout(() => router.push('/(app)/profile'), 0);
    };

    const handleLogout = async ()=>{
        await logout();
    }

    return (
        <View
            style={{ paddingTop: ios ? top : top + 10 }}
            className="flex-row items-center justify-between px-5 pb-3 bg-green-700 rounded-b-3xl shadow"
        >
            <Text className="text-white text-2xl font-semibold">Chats</Text>
            <Menu
                visible={open}
                onDismiss={closeMenu}
                anchorPosition="bottom"
                contentStyle={{ borderRadius: 12, minWidth: 180 }}
                anchor={
                    <Pressable
                        collapsable={false}
                        onPress={toggleMenu}
                        hitSlop={8}
                        className="size-12 rounded-full border border-white/70 shadow overflow-hidden"
                    >
                        <Image
                            source={{uri: user?.profileUrl}}
                            style={{ width: '100%', height: '100%', borderRadius: 9999 }}
                            contentFit="cover"
                            placeholder={blurhash}
                        />
                    </Pressable>
                }
            >
                <CustomMenuItem
                    title="Profile"
                    icon="account-circle"
                    onPress={handleProfile}
                    testID="menu-profile"
                />
                <Divider>
                    <View className="p-[1px] w-full bg-neutral-200 "></View>
                </Divider>
                <CustomMenuItem
                    title="Logout"
                    icon="logout"
                    danger
                    onPress={handleLogout}
                    testID="menu-logout"
                />
            </Menu>
        </View>
    );
}

export default HomeHeader;
