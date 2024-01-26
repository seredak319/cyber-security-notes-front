import React, {useState} from 'react';
import zxcvbn from 'zxcvbn';
import './RegisterPage.css';
import {useDispatch} from 'react-redux';
import authApi from '../../api/authApi';
import {setSuccessfulLogin} from "../../features/auth/authSlice";

const RegisterPage = () => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [qrCode, setQrCode] = useState(null);
    const [registerError, setRegisterError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();

    const calculatePasswordStrength = (password) => {
        const result = zxcvbn(password);
        return result.score;
    };

    const getPasswordStrengthLabel = (strength) => {
        switch (strength) {
            case 0:
                return 'Very Weak';
            case 1:
                return 'Weak';
            case 2:
                return 'Moderate';
            case 3:
                return 'Strong';
            case 4:
                return 'Very Strong';
            default:
                return '';
        }
    };

    const handleRegister = async () => {
        if (firstname.trim() === '' || lastname.trim() === '' || email.trim() === '' || password.trim() === '') {
            setRegisterError(true);
            setErrorMessage('All values should be completed');
            return;
        }

        if (!/^[a-zA-Z]+$/.test(firstname) || !/^[a-zA-Z]+$/.test(lastname)) {
            setRegisterError(true);
            setErrorMessage('Invalid character in name or lastname. Use only letters');
            return
        }

        if (firstname.length < 2 || lastname.length < 2) {
            setRegisterError(true);
            setErrorMessage('Too short first or last name');
            return;
        }

        if (firstname.length > 20 || lastname.length > 20) {
            setRegisterError(true);
            setErrorMessage('Too long first or last name');
            return;
        }

        if (email.length < 8) {
            setRegisterError(true);
            setErrorMessage('Too short email.');
            return;
        }

        if (email.length > 25) {
            setRegisterError(true);
            setErrorMessage('Too long email.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setRegisterError(true);
            setErrorMessage('Incorrect email');
            return;
        }

        if (password.length < 8) {
            setRegisterError(true);
            setErrorMessage('Too short password, at least 8 characters');
            return;
        }

        if (password.length > 64) {
            setRegisterError(true);
            setErrorMessage('Password doesnt have to be that long, you wont remember it ;)');
            return;
        }

        if (calculatePasswordStrength(password) < 3) {
            setRegisterError(true);
            setErrorMessage('Password is too weak. Please choose a stronger password.');
            return;
        }

        try {
            const response = await authApi.register(firstname, lastname, email, password);
            console.log('Registration successful', response.status);
            let accessToken = response.access_token
            let refreshToken = response.refresh_token
            dispatch(setSuccessfulLogin({accessToken, refreshToken}));

            let qrCode = response.qr_uri
            setQrCode(qrCode)

        } catch (error) {
            console.error('Registration failed', error);
            setErrorMessage('Something went wrong. Try again in a moment.')
            setRegisterError(true);
        }
    };

    const handleNameChange = (e) => {
        setFirstName(e.target.value)
        setRegisterError(false)
    }

    const handleSurenameChange = (e) => {
        setLastName(e.target.value)
        setRegisterError(false)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
        setRegisterError(false)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        setRegisterError(false)
    }

    return (
        <div className="container">
            {qrCode === null ? (
                <div className="auth-container">
                    <h2>Register</h2>
                    <div className="auth-form">

                        <label>First Name:</label>
                        <input type="text" value={firstname} onChange={(e) => {
                            handleNameChange(e)
                        }}/>

                        <label>Last Name:</label>
                        <input type="text" value={lastname} onChange={(e) => {
                            handleSurenameChange(e)
                        }}/>

                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => {
                            handleEmailChange(e)
                        }}/>

                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => {
                            handlePasswordChange(e)
                        }}/>

                        <div className="password-strength">
                            <progress value={calculatePasswordStrength(password)} max="4"/>
                            <span>Password Strength: {getPasswordStrengthLabel(calculatePasswordStrength(password))}</span>
                        </div>

                        <button onClick={handleRegister}>Register</button>
                        {registerError && <p className="error-message">{errorMessage}</p>}
                    </div>
                </div>
            ) : (
                <div className="qr-code-success-container">
                    <div>
                        <h3 className="success-message">Registration Successful!</h3>
                        <div className="qr-code-information-container">
                            <p>
                                Thank you for registering! To enhance the security of your account,
                                please set up two-factor authentication (2FA) using Google Authenticator.
                            </p>
                            <p>
                                Follow the guide on{' '}
                                <a href="https://support.google.com/accounts/answer/1066447" target="_blank" rel="noopener noreferrer">
                                    setting up 2FA with Google Authenticator
                                </a>{' '}
                                to learn more.
                            </p>
                            <div className="qr-code-alert">
                                <p>
                                    You will need to use Google Authenticator during the login process.
                                </p>
                            </div>

                        </div>
                    </div>
                    <div className="qr-code-container">
                        <h3>Scan QR Code for 2FA</h3>
                        <img src={qrCode} alt="qrcode" style={{width: "300px", height: "300px"}}/> {/* Adjust the size as needed */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterPage;
