// NavBar.js

import React from 'react';
import {Nav, Navbar, NavbarBrand} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import {setLogout} from '../../features/auth/authSlice';
import './NavBar.css';
import {NavLink} from "react-router-dom";
import authApi from "../../api/authApi"; // Import your custom CSS file

export const NavBar = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const accessToken = useSelector((state) => state.auth.accessToken);

    const handleLogOut = () => {
        authApi.logout(accessToken)
        dispatch(setLogout());
    };

    return (
        <Navbar className="custom-navbar" color="dark" dark expand="md">
            <Nav>
                <NavbarBrand tag={NavLink} to="/" className="navbar-link">
                    Home
                </NavbarBrand>
                <NavbarBrand tag={NavLink} to="/notes-public" className="navbar-link">
                    Public Notes
                </NavbarBrand>
                <NavbarBrand tag={NavLink} to="/notes-private" className="navbar-link">
                    My Notes
                </NavbarBrand>
                {!isAuthenticated && (
                    <>
                        <NavbarBrand tag={NavLink} to="/login" className="navbar-link">
                            Login
                        </NavbarBrand>
                        <NavbarBrand tag={NavLink} to="/register" className="navbar-link">
                            Register
                        </NavbarBrand>
                    </>
                )}
                {isAuthenticated && (
                    <NavbarBrand to="/" onClick={handleLogOut} className="navbar-link">
                        Logout
                    </NavbarBrand>
                )}
            </Nav>
        </Navbar>
    );
};
