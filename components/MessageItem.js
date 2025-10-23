import React from 'react';
import { View, Text } from 'react-native';

const MessageItem = ({message,currentUser}) => {
  if(currentUser?.userId===message?.userId) {
      //my message
      return (
          <View className="flex-row justify-end mb-3 mr-3">
            <View className="w-[80%]">
                <View className="flex self-end p-3 rounded-2xl bg-green-100 border border-green-200">
                    <Text>
                        {message.text}
                    </Text>
                </View>
            </View>
          </View>
      )
  }else{
      return (
          <View className="w-[80%] ml-3 mb-3">
            <View className="flex self-start p-3 px-4 rounded-2xl bg-indigo-100 border border-indigo-200">
                <Text>
                    {message.text}
                </Text>
            </View>
          </View>
      )
  }
};

export default MessageItem;