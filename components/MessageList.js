import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import MessageItem from "@/components/MessageItem";

const MessageList = ({messages, currentUser,scrollViewRef}) => {
  return (
    <ScrollView ref = {scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop:10}}>
        {
            messages.map((message, index) => {
                return (
                    <MessageItem message={message} key={index} currentUser={currentUser}/>
                )
            })
        }
    </ScrollView>
  );
};

export default MessageList;