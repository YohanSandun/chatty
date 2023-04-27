import React, { useState } from "react";
import './Signup.css';
import app from '../../lib/firebase';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'
import BackdropOverlay from "../../components/BackdropOverlay";
import Alert from '@mui/material/Alert';
import { setDoc, doc, getFirestore } from "firebase/firestore";

function Signup() {

    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState({
        email: false,
        pass: false,
        passConfirm: false,
        username: false,
    });
    const [signupError, setSignupError] = useState(null);

    const validateFields = () => {
        let errs = { ...errors }

        errs.email = email.trim().length === 0;
        errs.username = username.trim().length === 0;
        errs.pass = pass.length < 6;
        errs.passConfirm = passConfirm !== pass;

        setErrors(errs);

        return !(errs.email || errs.pass || errs.username || errs.passConfirm);
    }

    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, email, pass)
            .then((user) => {

                setDoc(doc(db, "users", user.user.uid), {
                    name: username,
                    email: email,
                    chats: 0,
                }).then(() => {
                    setOpen(false);
                    navigate("/home")
                }).catch(() => {
                    setOpen(false);
                    setSignupError("Signup failed!");
                });

            })
            .catch((error) => {
                setOpen(false);
                setSignupError(error.code);
            });
    }

    const handleSubmit = (e) => {
        setOpen(true);
        e.preventDefault();

        if (validateFields()) {
            handleSignup();
            return true;
        }

        setOpen(false);
        return false;
    }

    return (
        <div className="signup-page">
            <form className="signup-panel" onSubmit={handleSubmit}>
                <h2>SIGNUP</h2>
                {
                    signupError && <Alert variant="filled" severity="error">
                        {signupError}
                    </Alert>
                }
                <div className="email-pass-signup">
                    <div className="email-pass-row">
                        <input type="text" required className={errors.username ? 'error' : ''} value={username} onChange={(e) => setUsername(e.target.value)} name="username" id="username" />
                        <label htmlFor="username">Name</label>
                    </div>
                    <div className="email-pass-row">
                        <input type="text" required className={errors.email ? 'error' : ''} value={email} onChange={(e) => setEmail(e.target.value)} name="email" id="email" />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="email-pass-row">
                        <input type="password" required className={errors.pass ? 'error' : ''} value={pass} onChange={(e) => setPass(e.target.value)} name="password" id="password" />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="email-pass-row">
                        <input type="password" required className={errors.passConfirm ? 'error' : ''} value={passConfirm} onChange={(e) => setPassConfirm(e.target.value)} name="password_confirm" id="password_confirm" />
                        <label htmlFor="password_confirm">Confirm Password</label>
                    </div>
                    <button type="submit">SIGNUP</button>
                </div>
                <p className="signup-msg">Already have an account? <a href="/login">Log in</a></p>
            </form>

            <BackdropOverlay open={open} />
        </div>
    )
}

export default Signup;