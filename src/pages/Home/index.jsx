import React, { useEffect, useState } from "react";
import './Home.css';
import Chat from "../../components/Chat";
import app from '../../lib/firebase';
import { getFirestore, query, collection, where, getDocs, doc } from "firebase/firestore";

function Home() {
    const db = getFirestore(app);
    let myid = '1JJpNGphVhZyAXhGP4GYk86OKc53';

    const [chats, setChats] = useState([]);

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = () => {
        const q = query(collection(db, "chats"), where("participants", "array-contains", doc(db, "/users/"+myid)));
        getDocs(q).then((querySnapshot) => {
            let _chats = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                if (data.participants.length === 2) {
                    if (data.participants[0] === myid) {
                        _chats.push({
                            name: data.participant_names[0],
                            lastMessage: ''
                        });
                    } else {
                        _chats.push({
                            name: data.participant_names[1],
                            lastMessage: ''
                        });
                    }
                }
               
            });
            setChats(_chats);

        }).catch((err) => console.log(err));
    }

    return (
        <div className="chats-home">
            <div className="chats">
                {
                    chats.map((item, index) => (
                        <Chat key={index} name={item.name} lastMessage={item.lastMessage}/>
                    ))
                }
            </div>
            <div className="messages"></div>
        </div>
    )
}

export default Home;