import React, { useState } from "react";
import './Login.css';

function Login() {

    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (phone.trim().length === 0) {
            setPhoneError(true);
            return false;
        }
        
        setPhoneError(false);
        return true;
    }

    return (
        <div className="login-page">
            <form className="login-panel" onSubmit={handleSubmit}>
                <label htmlFor="phone">Phone Number</label>
                <input type="text" className={phoneError ? 'error' : ''} value={phone} onChange={(e) => setPhone(e.target.value)} name="phone" id="phone" />
                <button type="submit">LOGIN</button>
            </form>
        </div>
    )
}

export default Login;