import React, {useEffect, useState} from 'react';
import {View, StatusBar, ActivityIndicator} from 'react-native';
import {useAuth} from "@/context/authContext";
import ChatList from "@/components/ChatList";
import {query,where,getDocs} from "firebase/firestore";
import {usersRef} from "@/firebaseConfig";

const Home = () => {
    const {logout} = useAuth();
    const {user} = useAuth();

    const[users, setUsers] = useState([]);

    useEffect(() => {
        if(user?.uid){
            getUsers().catch((e) => console.error(e));
        }
    },[])

    const getUsers = async () => {
        const q = query(usersRef, where('userId','!=',user?.uid));

        const querySnapshot = await getDocs(q);
        let data =[];
        querySnapshot.forEach(doc => {
            data.push({...doc.data()});
        })
        setUsers(data);

    }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light"/>

        {
            users.length>0? (
                <ChatList currentUser ={user} users ={users}/>
            ):(
                <View className="flex items-center pt-20">
                    <ActivityIndicator size="large"/>
                </View>
            )
        }
    </View>
  );
};

export default Home;