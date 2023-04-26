import React, { useEffect, useRef, useState } from "react";
import './Home.css';
import Chat from "../../components/Chat";
import app from '../../lib/firebase';
import { increment, updateDoc, orderBy, onSnapshot, getFirestore, query, collection, where, getDocs, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import NewChat from "../../dialogs/NewChat";
import AddCommentIcon from '@mui/icons-material/AddComment';
import SendIcon from '@mui/icons-material/Send';
import BackdropOverlay from "../../components/BackdropOverlay";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Home() {

    var userName = useRef('');

    const db = getFirestore(app);
    const auth = getAuth(app);

   
    const [chats, setChats] = useState([]);
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [showNewChat, setShowNewChat] = useState(false);
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);

    const scrollElementRef = useRef(null);
    const mydocRef = useRef(null);
    const chatsRef = useRef(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                let d = doc(db, '/users/' + user.uid);
                onSnapshot(d, snapshot => {
                    userName.current = snapshot.data().name;
                    mydocRef.current = d;
                    loadChats();
                });
            } else {
                console.log("user is logged out")
            }
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        loadMessages();
        // eslint-disable-next-line
    }, [chat]);

    useEffect(() => {
        scrollElementRef.current.scrollTop = scrollElementRef.current.scrollHeight;
    }, [messages])

    const showChats = () => {
        chatsRef.current.classList.add("show-chats");
    }

    const hideChats = () => {
        chatsRef.current.classList.remove("show-chats");
    }

    const loadMessages = () => {
        if (chat === null) {
            return;
        }
        
        hideChats();

        onSnapshot(query(collection(db, "chats/" + chat.id + '/messages'), orderBy("time", "asc")), querySnapshot => {
            let _messages = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                _messages.push({
                    fromMe: data.from.id === mydocRef.current.id,
                    content: data.content,
                    time: data.time
                });
            });
            setMessages(_messages);
        });
    }

    const loadChats = () => {
        const q = query(collection(db, "chats"), where("participants", "array-contains", mydocRef.current));
        getDocs(q).then((querySnapshot) => {
            let _chats = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                if (data.participants.length === 2) {
                    if (data.participants[0].id === mydocRef.current.id) {
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
                            otherUser: data.participants[0],
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
            from: mydocRef.current,
            to: chat.otherUser,
            time: serverTimestamp()
        }).then(() => setMessage(''));
    }

    const addNewChat = () => {
        setOpen(true);
        const q = query(collection(db, "users"), where("email", "==", email));
        getDocs(q).then(querySnapshot => {
            if (querySnapshot.docs.length > 0) {
                let otherUser = doc(db, "users/" + querySnapshot.docs[0].id);
                addDoc(collection(db, "chats"), {
                    participants: [mydocRef.current, otherUser],
                    participant_names: [userName.current, querySnapshot.docs[0].data().name]
                }).then(() => {
                    setShowNewChat(false);
                    setOpen(false);
                    loadChats();
                })
                
                updateDoc(otherUser, {
                    chats: increment(1)
                });

            } else {
                setOpen(false);
                alert("User not found!");
            }
        });
    }

    return (
        <div className="chats-home">
            <div className="chats" ref={chatsRef}>
                <ArrowBackIcon onClick={hideChats} />
                {
                    chats.map((item, index) => (
                        <Chat key={index} chat={item} setChat={setChat} />
                    ))
                }
                <div className="new-chat" onClick={() => setShowNewChat(true)}>
                    <AddCommentIcon />
                </div>
            </div>
            <div className="messages">
                <div className="message-header">
                    <FormatListBulletedIcon onClick={showChats}/>
                    <div className="profile-pic">
                        <img src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg" alt="Profile" />
                    </div>
                    <div className="other-info">
                        <b>{chat && chat.name}</b>
                    </div>
                </div>
                <div className="messages-list" ref={scrollElementRef}>
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
                            <SendIcon />
                        </div>
                    </div>
                </div>
            </div>

            {showNewChat && <NewChat setShowNewChat={setShowNewChat} email={email} setEmail={setEmail} addNewChat={addNewChat} />}

            <BackdropOverlay open={open}/>
        </div>
    )
}

export default Home;