import React, { useState } from "react";
import './Login.css';
import app from '../../lib/firebase';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'
import BackdropOverlay from "../../components/BackdropOverlay";
import Alert from '@mui/material/Alert';

function Login() {
    const navigate = useNavigate();
    const auth = getAuth(app);

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [errors, setErrors] = useState({
        email: false,
        pass: false
    });
    const [loginError, setLoginError] = useState(null);

    const validateFields = () => {
        let errs = { ...errors }

        errs.email = email.trim().length === 0;
        errs.pass = pass.trim().length < 6;

        setErrors(errs);

        return !(errs.email || errs.pass);
        // setErrors(prevErrors => ({
        //     ...prevErrors,
        //     email: true
        // }));
    }

    const handleLogin = () => {
        console.log("Goin to login");
        signInWithEmailAndPassword(auth, email, pass)
            .then(() => {
                setOpen(false);
                navigate("/home")
            })
            .catch((error) => {
                setOpen(false);
                setLoginError(error.code);
            });
    }

    const handleSubmit = (e) => {
        setOpen(true);
        e.preventDefault();

        if (validateFields()) {
            handleLogin();
            return true;
        }

        setOpen(false);
        return false;
    }

    return (
        <div className="login-page">
            <form className="login-panel" onSubmit={handleSubmit}>
                <h2>LOGIN</h2>
                {
                    loginError && <Alert variant="filled" severity="error">
                        {loginError}
                    </Alert>
                }
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
                <p className="signup-msg">Don't have an account? <a href="/signup">Sign up</a></p>
            </form>

            <BackdropOverlay open={open} />
        </div>
    )
}

export default Login;