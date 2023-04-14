import React from "react";
import './Login.css';

function Login() {
    return (
        <div className="login-page">
            <div className="login-panel">
                <label for="phone">Phone Number</label>
                <input type="phone" name="phone" id="phone" />
                <button>LOGIN</button>
            </div>
        </div>
    )
}

export default Login;