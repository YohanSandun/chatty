import React, { useState } from "react";
import ''
function Signup() {

    const navigate = useNavigate();
    const auth = getAuth(app);

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState({
        email: false,
        pass: false,
        username: false,
    });

    const validateFields = () => {
        let errs = { ...errors }

        errs.email = email.trim().length === 0;
        errs.username = username.trim().length === 0;
        errs.pass = pass.length < 6;

        setErrors(errs);

        return !(errs.email || errs.pass || errs.username);
    }

    return (
        <div className="signup-page">
            <form className="signup-panel" onSubmit={handleSubmit}>
                <h2>SIGNUP</h2>
                {
                    loginError && <Alert variant="filled" severity="error">
                        {loginError}
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
                    <button type="submit">SIGNUP</button>
                </div>
                <p className="signup-msg">Already have an account? <a href="/login">Log in</a></p>
            </form>

            <BackdropOverlay open={open} />
        </div>
    )
}

export default Signup;