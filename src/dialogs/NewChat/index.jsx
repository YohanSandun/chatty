import React from "react";
import './NewChat.css';

function NewChat({ setShowNewChat, email, setEmail, addNewChat }) {
    return (
        <div className="new-chat-dialog-bg" onClick={() => setShowNewChat(false)}>
            <div className="new-chat-dialog" onClick={(e) => e.stopPropagation()}>
                <p>Enter email address</p>
                <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={() => addNewChat()}>Add</button>
            </div>
        </div>
    );
}

export default NewChat;