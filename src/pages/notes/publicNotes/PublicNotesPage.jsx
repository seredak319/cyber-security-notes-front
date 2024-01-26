import React, { useEffect, useState } from 'react';

import './styles.css';
import {notesApi} from "../../../api/notesApi";
import {useSelector} from "react-redux";
import PublicNote from "../../../components/notes/PublicNote";

const PublicNotesPage = () => {
    const [notes, setNotes] = useState([]);
    const accessToken = useSelector((state) => state.auth.accessToken);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                if (accessToken) {
                    console.log("fetching all public")
                    const response = await notesApi.getAllPublic(accessToken)
                    setNotes(response);
                }
            } catch (error) {
                console.error('Error fetching notes', error);
            }
        };

        fetchNotes()
    }, [accessToken]);


    return (
        <div className="notes-page">
            <h2 className="page-title">Public notes</h2>

            <div className="notes-container">
                {notes.map((note) => (
                    <PublicNote key={note.id} note={note} />
                ))}
            </div>
        </div>
    );
};

export default PublicNotesPage;
