import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StatusBar, TextInput, TouchableOpacity, Alert, Keyboard} from 'react-native';
import {useLocalSearchParams, useRouter} from "expo-router";
import ChatRoomHeader from "@/components/ChatRoomHeader";
import MessageList from "@/components/MessageList";
import Feather from '@expo/vector-icons/Feather';
import CustomKeyboardView from "@/components/CustomKeyboardView";
import {useAuth} from "@/context/authContext";
import {getRoomId} from "@/utils";
import {collection, doc, setDoc, Timestamp, addDoc, query,orderBy, onSnapshot} from "firebase/firestore";
import {db} from "@/firebaseConfig";


const ChatRoom = () => {

    const item = useLocalSearchParams();//second user
    const {user} = useAuth();
    const router = useRouter();
    const[messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        createRoomIfNotExist().catch((e) => console.error(e));

        let roomId = getRoomId(user?.userId,item?.userId);
        const docRef = doc(db,'rooms',roomId);
        const messagesRef = collection(docRef,'messages');
        const q = query(messagesRef,orderBy('createdAt','asc'));

        let unsub = onSnapshot(q,(snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            })
            setMessages([...allMessages]);
        })

        const KeyboardDidShowListener = Keyboard.addListener('keyboardDidShow',updateScrollView);

        return () => {
           unsub();
           KeyboardDidShowListener.remove();
        }

    },[]);

    useEffect(() => {
        updateScrollView();
    },[messages]);

    const updateScrollView = () =>{
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({animated:true});
        },100)
    };

    const createRoomIfNotExist = async () => {
        let roomId = getRoomId(user?.userId,item?.userId);
        await setDoc(doc(db,'rooms',roomId),{
            roomId,
            createdAt : Timestamp.fromDate(new Date()),

        });
    }

    const handleSendMessage = async () => {
        let message = textRef.current.trim();
        if(!message) return;
        try {
            let roomId = getRoomId(user?.userId,item?.userId);
            const docRef = doc(db,'rooms',roomId);
            const messagesRef = collection(docRef,'messages');

            textRef.current = "";
            if(inputRef) inputRef?.current?.clear();

            const newDoc = await addDoc(messagesRef,{
                userId: user?.userId,
                text : message,
                profileUrl : user?.profileUrl,
                senderName : user?.username,
                createdAt : Timestamp.fromDate(new Date()),
            });
        }catch(err){
            Alert.alert('Message',err.message);
        }
    }

  return (
      <CustomKeyboardView>
         <View className="flex-1 bg-white">
             <StatusBar style="dark" />
             <ChatRoomHeader user={item} router={router}/>
             <View className="h-3 border-b border-b-neutral-300 mt-2"/>
             <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
                 <View className="flex-1">
                        <MessageList messages={messages} currentUser ={user} scrollViewRef={scrollViewRef} />
                 </View>
                 <View className="pt-3 mb-5">
                       <View className="flex-row items-end mx-4">
                            <View className="flex-1 flex-row items-center bg-white border border-neutral-300 rounded-full px-5 py-3 shadow-sm">
                             <TextInput
                                 ref = {inputRef}
                                 onChangeText={value=>textRef.current=value}
                                 placeholder="Type your message..."
                                 placeholderTextColor="#9ca3af"
                                 className="flex-1 h-12 text-[16px] leading-none text-neutral-800 pr-3"
                             />
                             <TouchableOpacity
                                 onPress={handleSendMessage}
                                  className="w-12 h-12 rounded-full bg-white border p-2 border-neutral-300 items-center justify-center shadow-sm mr-1"
                                  activeOpacity={0.7}
                             >
                                  <Feather name="send" size={24} color="black" />
                             </TouchableOpacity>
                            </View>
                     </View>
                    </View>
                </View>
         </View>
      </CustomKeyboardView>
  );
};

export default ChatRoom;