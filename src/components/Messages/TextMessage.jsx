import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";

function TextMessage({ item }) {
    if (item.time === null) {
        item.time = new Timestamp();
    }

    let date = item.time.toDate();
    let hours = date.getHours();
    let mins = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';

    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    if (mins <= 9) {
        mins = '0'+mins;
    }

    const [folded, setFolded] = useState(false);

    return (
        <div className={item.fromMe ? "message my-message" : "message"}>
            { folded ? <div>{item.content.substring(0, 300) + '...'}<span onClick={() => setFolded(false) } className="read-more">Read more</span></div> : item.content }
            <div className="time">{`${hours}:${mins} ${ampm}`}</div>
        </div>
    )
}

export default TextMessage;