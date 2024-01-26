import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {NavBar} from './components/navBar/NavBar'
import WelcomeHome from "./pages/home/WelcomeHome";
import LoginPage from "./pages/login/LoginPage";
import PrivateNotesPage from "./pages/notes/privateNotes/PrivateNotesPage";
import {RequireAuth} from "./components/auth/RequireAuth";
import PublicNotesPage from "./pages/notes/publicNotes/PublicNotesPage";
import RegisterPage from "./pages/register/RegisterPage";


export default function App() {
    return (
        <>
            <NavBar/>
            <Routes>
                <Route path="/" element={<WelcomeHome/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/register' element={<RegisterPage/>}/>
                <Route path='/notes-public' element={<RequireAuth>{<PublicNotesPage/>}</RequireAuth>}/>
                <Route path='/notes-private' element={<RequireAuth>{<PrivateNotesPage/>}</RequireAuth>}/>
            </Routes>
        </>
    )
}
