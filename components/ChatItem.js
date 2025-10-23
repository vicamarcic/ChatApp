import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import {formatDate, getRoomId} from "@/utils";
import {collection, doc, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "@/firebaseConfig";

const ChatItem = ({item,index,noBorder,router,currentUser}) => {

    const[lastMessage,setLastMessage] = useState(undefined);

    useEffect(() => {

        let roomId = getRoomId(currentUser?.userId,item?.userId);
        const docRef = doc(db,'rooms',roomId);
        const messagesRef = collection(docRef,'messages');
        const q = query(messagesRef,orderBy('createdAt','desc'));

        const unsub = onSnapshot(q,(snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            })
            setLastMessage(allMessages[0]? allMessages[0] : null);
        })
        return unsub;
    },[]);

    const openChatRoom = () => {
        router.push({pathname:'/chatRoom',params:item});
    };

    const renderTime = ()=>{
        if(lastMessage){
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        }
    };

    const renderLastMessage = ()=>{
        if(typeof lastMessage === 'undefined'){
            return 'Loading...';
        }
        if(lastMessage){
            if(currentUser?.userId === lastMessage.userId){
                return "You: " + lastMessage?.text;
            }else{
                return lastMessage?.text;
            }
        }else{
            return 'You don\'t have any messages!';
        }
    };

  return (
      <TouchableOpacity
          onPress={openChatRoom}
          activeOpacity={0.7}
          style={{ paddingHorizontal: 16, paddingVertical: 10 }}
          className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-4 ${noBorder ? '' : 'border-b border-b-neutral-200'}`}
      >
          <Image
              source={{uri : item?.profileUrl}}
              contentFit="cover"
              style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.08)',
                  backgroundColor: '#f3f4f6',
              }}
          />
          <View className="flex-1 gap-1">
            <View className="flex-row justify-between">
                <Text className="text-neutral-900 font-semibold text-base leading-5">{item?.username}</Text>
                <Text className="text-neutral-900 font-medium text-base leading-5">
                    {renderTime()}
                </Text>
            </View>
                <Text className="text-neutral-900  text-base leading-5">
                    {renderLastMessage()}
                </Text>
          </View>
      </TouchableOpacity>
  );
};

export default ChatItem;