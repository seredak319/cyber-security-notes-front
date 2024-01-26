import lockIcon from './img/lock-icon.png';
import shareIcon from './img/share-icon.png';
import createIcon from './img/create-icon.png';
import {Link} from "react-router-dom";
import './WelcomeHome.css'
import React from "react";

const WelcomeHome = (props) => {
    return (
        <div className="welcome-container">
            <h2 className="welcome-heading">Welcome to Secure Notes App</h2>
            <p className="welcome-description">Your place to keep things organized and secure!</p>
            <div className="feature-list">
                <div className="feature-item">
                    <img src={lockIcon} alt="Encrypt" className="feature-icon"/>
                    <p>Encrypt Notes</p>
                </div>
                <div className="feature-item">
                    <img src={shareIcon} alt="Share" className="feature-icon"/>
                    <p>Share Notes</p>
                </div>
                <div className="feature-item">
                    <img src={createIcon} alt="Create" className="feature-icon"/>
                    <p>Create Your Own</p>
                </div>
            </div>
            <Link to="/notes-private" className="link">
                <button className="btn2">Let's see your notes!</button>
            </Link>
        </div>
    );
};

export default WelcomeHome;
