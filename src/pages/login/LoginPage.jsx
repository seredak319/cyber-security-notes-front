import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './LoginPage.css';
import {useDispatch} from 'react-redux';
import {setSuccessfulLogin} from '../../features/auth/authSlice';
import authService from "../../api/authApi";

let SUCCESS_STATUS = 'Success'
let LOCKED_STATUS = 'Locked'
let NOT_SUCCESS_STATUS = 'Not Success'

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [totp, setTotp] = useState('');
    const [loginError, setLoginError] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (isButtonDisabled) {
            return;
        }

        if (password.length < 8 || username.length < 8 || totp.length !== 6) {
            setLoginError(true);
            setMessage('Verify entered data.')
            return;
        }

        if (password.length > 64 || username.length > 25) {
            setLoginError(true);
            setMessage('Verify entered data.')
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            setMessage('Verify entered data.')
            setLoginError(true);
            return;
        }

        try {
            setButtonDisabled(true);
            const response = await authService.login(username, password, totp);
            await sleep(2000);
            setLoginError(false);
            let responseData = response.data;
            switch (responseData.status) {
                case SUCCESS_STATUS: {
                    let accessToken = responseData.access_token;
                    let refreshToken = responseData.refresh_token;
                    dispatch(setSuccessfulLogin({accessToken, refreshToken}));
                    navigate('/');
                    break;
                }
                case NOT_SUCCESS_STATUS: {
                    setLoginError(true)
                    setMessage('Login failed, try again.')
                    break;
                }
                case LOCKED_STATUS: {
                    setLoginError(true)
                    setMessage('User is locked, please contact admin @KrystianSereda.')
                    break;
                }
                default: {
                    setLoginError(true)
                    setMessage('An error occurred. Please try in a while.')
                }
            }
        } catch (error) {
            if (error.status === 403) {
                setLoginError(true)
                setMessage('Login failed, try again.')
                return;
            }

            console.error('Login failed', error);
            setLoginError(true);
            setMessage('An error occurred. Please try in a while.')
        } finally {
            // Re-enable the button after a delay (e.g., 2 seconds) whether login succeeds or fails
            setTimeout(() => {
                setButtonDisabled(false);
            }, 3000);
        }
    };

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    const handleLoginChange = (e) => {
        setLoginError(false);
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setLoginError(false);
        setPassword(e.target.value);
    };

    const handleTotpChange = (e) => {
        setLoginError(false);
        setTotp(e.target.value);
    };

    return (
        <div className="container">
            <div className="auth-container">
                <h2>Login</h2>
                <div className="auth-form">
                    <label>Email:</label>
                    <input type="username" value={username} onChange={(e) => handleLoginChange(e)}/>

                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => handlePasswordChange(e)}/>

                    <label>6-digit TOTP:</label>
                    <input type="text" value={totp} onChange={(e) => handleTotpChange(e)}/>

                    <button onClick={handleLogin}>Login</button>
                    {loginError && <p className="error-message">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
