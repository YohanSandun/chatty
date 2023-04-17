import React, { useEffect, useRef, useState } from "react";
import './Home.css';
import Chat from "../../components/Chat";
import app from '../../lib/firebase';
import { orderBy, onSnapshot, getFirestore, query, collection, where, getDocs, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Home() {
    const db = getFirestore(app);
    const auth = getAuth(app);

    const [mydoc, setMydoc] = useState(null);
    const [chats, setChats] = useState([]);
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const scrollElement = useRef(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setMydoc(doc(db, '/users/' + user.uid));
            } else {
                console.log("user is logged out")
            }
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        loadChats();
        // eslint-disable-next-line
    }, mydoc);

    useEffect(() => {
        loadMessages();
        // eslint-disable-next-line
    }, [chat]);

    useEffect(() => {
        scrollElement.current.scrollTop = scrollElement.current.scrollHeight;
    }, [messages])

    const loadMessages = () => {
        if (chat === null) {
            return;
        }
        
        onSnapshot(query(collection(db, "chats/" + chat.id + '/messages'), orderBy("time", "asc")), querySnapshot => {
            let _messages = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                _messages.push({
                    fromMe: data.from.id === mydoc.id,
                    content: data.content,
                    time: data.time
                });
            });
            setMessages(_messages); 
        });
    }

    const loadChats = () => {
        const q = query(collection(db, "chats"), where("participants", "array-contains", mydoc));
        getDocs(q).then((querySnapshot) => {
            let _chats = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                if (data.participants.length === 2) {
                    if (data.participants[0].id === mydoc.id) {
                        _chats.push({
                            id: doc.id,
                            name: data.participant_names[1],
                            otherUser: data.participants[1],
                            lastMessage: ''
                        });
                    } else {
                        _chats.push({
                            id: doc.id,
                            name: data.participant_names[0],
                            otherUser: data.participants[1],
                            lastMessage: ''
                        });
                    }
                }

            });
            setChats(_chats);

        }).catch((err) => console.log(err));
    }

    const sendMessage = () => {
        addDoc(collection(db, "chats/" + chat.id + "/messages"), {
            content: message,
            from: mydoc,
            to: chat.otherUser,
            time: serverTimestamp()
        }).then(() => setMessage(''));
    }

    return (
        <div className="chats-home">
            <div className="chats">
                {
                    chats.map((item, index) => (
                        <Chat key={index} chat={item} setChat={setChat} />
                    ))
                }
            </div>
            <div className="messages">

                <div className="message-header">
                    <div className="profile-pic">
                        <img src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg" alt="Profile" />
                    </div>
                    <div className="other-info">
                        <b>Hello</b>
                    </div>
                </div>
                <div className="messages-list" ref={scrollElement}>
                    {/* <div className="message">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente animi, minus aspernatur iusto sequi, porro eius quam eaque corporis reprehenderit doloribus excepturi! Eos error dignissimos magni id, consequuntur reprehenderit adipisci.
                    </div>
                    <div className="message my-message">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente animi, minus aspernatur iusto sequi, porro eius quam eaque corporis reprehenderit doloribus excepturi! Eos error dignissimos magni id, consequuntur reprehenderit adipisci.
                    </div> */}
                    {
                        chat &&
                        messages.map((item, index) => (
                            <div key={index} className={item.fromMe ? "message my-message" : "message"}>
                                {item.content}
                            </div>
                        ))
                    }
                </div>
                <div className="message-input-container">
                    <div className="message-input">
                        <textarea value={message} onChange={e => setMessage(e.target.value)} name="text" id="text" rows="1" placeholder="Your Message"></textarea>
                        <div className="send-button" onClick={() => sendMessage()}>
                            SEND
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;