import React from "react";

function Chat({chat, setChat}) {
    return (
        <div className="chat" onClick={() => setChat(chat)}>
            <div className="profile-pic">
                <img src="https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg" alt="Profile" />
            </div>
            <div className="other-info">
                <b>{chat.name}</b>
                <p>{chat.lastMessage}</p>
            </div>
        </div>
    );
}

export default Chat;