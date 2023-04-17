import React, { useState } from "react";
import './Login.css';
// import app from '../../lib/firebase';

function Login() {

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [errors, setErrors] = useState({
        email: false,
        pass: false
    })

    const validateFields = () => {
        let errs = { ...errors }

        errs.email = email.trim().length === 0;
        errs.pass = pass.trim().length < 6;

        setErrors(errs);

        return errs.email || errs.pass;
        // setErrors(prevErrors => ({
        //     ...prevErrors,
        //     email: true
        // }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateFields()) {
            return true;
        }

        return false;
    }

    return (
        <div className="login-page">
            <form className="login-panel" onSubmit={handleSubmit}>
                <div className="email-pass-login">
                    <div className="email-pass-row">
                        <input type="text" required className={errors.email ? 'error' : ''} value={email} onChange={(e) => setEmail(e.target.value)} name="email" id="email" />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="email-pass-row">
                        <input type="password" required className={errors.pass ? 'error' : ''} value={pass} onChange={(e) => setPass(e.target.value)} name="password" id="password" />
                        <label htmlFor="password">Password</label>
                    </div>
                    <button type="submit">LOGIN</button>
                </div>
            </form>
        </div>
    )
}

export default Login;