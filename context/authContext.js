import {createContext, useContext, useEffect, useState} from "react";
import {onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {auth, db} from '@/firebaseConfig';
import {doc,setDoc,getDoc,onSnapshot} from 'firebase/firestore'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const[user, setUser] = useState(null);
    const[isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        let offDoc;

        const offAuth = onAuthStateChanged(auth, (fbUser) => {
            offDoc?.();
            if (!fbUser) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }

            setIsAuthenticated(true);
            setUser(prev => ({
                ...prev,
                uid: fbUser.uid,
                email: fbUser.email ?? prev?.email ?? '',
                username: fbUser.username ?? prev?.username ?? '',
                profileURL: fbUser.profileURL ?? prev?.profileURL ?? '',
            }));

            offDoc = onSnapshot(doc(db, 'users', fbUser.uid), (snap) => {
                if (snap.exists()) {
                    const data = snap.data();
                    setUser(prev => ({ ...prev, ...data, uid: prev?.uid ?? fbUser.uid }));
                }
            });
        });

        return () => { offDoc?.(); offAuth(); };
    }, []);


    const updateUserData = async (userId) => {
        const docRef = doc(db, 'users',userId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            let data = docSnap.data();
            setUser({...user,username: data.username,profileUrl:data.profileUrl,userId:data.userId});
        }
    }

    const login = async (email,password) => {
        try{
            const response = await signInWithEmailAndPassword(auth,email,password);
            return {success:true};
        }catch (e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) msg='Invalid email';
            if(msg.includes('(auth/invalid-credentials)')) msg='Wrong credentials';
            return {success:false, msg};
        }
    }

    const logout = async () => {
        try{
            await signOut(auth);
            return {success:true};
        }catch (e){
            return {success:false,msg :e.message,error:e};
        }
    }

    const register = async (email,password,username,profileUrl) => {
        try{
            const response = await createUserWithEmailAndPassword(auth,email,password);
            console.log(response?.user);

            await setDoc(doc(db,'users',response?.user?.uid),{
                username,
                profileUrl,
                userId: response?.user?.uid
            });
            return {success:true, data:response?.user};
        }catch (e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) msg='Invalid email';
            if(msg.includes('(auth/email-already-in-use)')) msg='This email is already in use';
            return {success:false, msg};
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated,login, logout,register}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    const value = useContext(AuthContext);

    if(!value){
        throw new Error('Method not implemented.');
    }
    return value;
};