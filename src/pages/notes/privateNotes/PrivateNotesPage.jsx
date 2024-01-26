import React, {useEffect, useState} from 'react';

import './styles.css';
import {useSelector} from "react-redux";
import {notesApi} from "../../../api/notesApi";
import ReactMarkdown from "react-markdown";
import DOMPurify from 'dompurify';
import PrivateNote from "../../../components/notes/PrivateNote";

const PrivateNotesPage = () => {

    let initNote = {
        title: '',
        text: '',
        isEncrypted: false,
        isPublic: false,
        password: ''
    }

    const [notes, setNotes] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newNote, setNewNote] = useState(initNote);
    const [message, setMessage] = useState(null)
    const accessToken = useSelector((state) => state.auth.accessToken);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                if (accessToken) {
                    console.log("fetching all private")
                    const response = await notesApi.getAllPrivate(accessToken)
                    setNotes(response); // Problematic line
                }
            } catch (error) {
                console.error('Error fetching notes', error);
            }
        };

        fetchNotes()
    }, [accessToken]); // Only run effect when accessToken changes

    const sanitizeMarkdown = (content) => {
        return DOMPurify.sanitize(content);
    };

    const handleDelete = async (noteId) => {
        try {
            if (accessToken) {
                await notesApi.deleteNote(noteId, accessToken)
                setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
            }
        } catch (error) {
            console.error('Error deleting notes', error);
        }
    };

    const handleEdit = async (editedNote) => {
        try {
            if (accessToken) {
                notesApi.update(editedNote, accessToken)
                let response = notesApi.getAllPrivate(accessToken)
                setNotes(response.data);
            }
        } catch (error) {
            console.error('Error editing notes', error);
        }
    };

    function isValidNote() {
        if (newNote.isEncrypted && (!newNote.password || newNote.password.length < 6 || newNote.password.length > 24)) {
            setMessage("Password must be between 6 and 24 characters.")
            console.log("Password must be between 6 and 24 characters.");
            return false;
        }

        if (!newNote.text || newNote.text.length < 1 || newNote.text.length > 200) {
            setMessage("Text must be between 1 and 200 characters.")
            console.log("Text must be between 1 and 200 characters.");
            return false;
        }

        if (!newNote.title || newNote.title.length < 1 || newNote.title.length > 50) {
            setMessage("Title must be between 1 and 50 characters.")
            console.log("Title must be between 1 and 50 characters.");
            return false;
        }
        return true;
    }


    const handleCreate = async () => {
        try {
            if (accessToken) {
                if (isValidNote()) {
                    notesApi.createNote(newNote, accessToken)
                    const response = await notesApi.getAllPrivate(accessToken)
                    setNotes(response)
                    setShowCreateForm(false);
                }
            }
        } catch (error) {
            console.error('Error creating notes', error);
        }
    };

    const handleCancel = () => {
        setShowCreateForm(false);
    };

    return (
        <div className="notes-page">
            <h2>My Notes</h2>

            {!showCreateForm && (
                <button className="btn2" onClick={() => setShowCreateForm(true)}>Create New Note</button>
            )}

            {showCreateForm && (
                <div className="create-form">
                    <input
                        className="note-title"
                        type="text"
                        placeholder="Title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    />
                    <textarea
                        className="note-text"
                        placeholder="Text"
                        value={newNote.text}
                        onChange={(e) => {
                            setMessage(null)
                            setNewNote({...newNote, text: e.target.value})
                        }}/>
                    {newNote.isEncrypted && <input
                        className="note-password"
                        type="password"
                        placeholder="password"
                        value={newNote.password}
                        onChange={(e) => setNewNote({...newNote, password: e.target.value})}
                    />}
                    <div className="form-buttons">
                        <button className="btn2" style={{margin: '10px'}} onClick={handleCreate}>Create</button>
                        <button className="btn2" style={{background: 'lightgray'}} onClick={handleCancel}>Cancel
                        </button>
                    </div>
                    <div className="checkbox">
                        <input
                            type="checkbox"
                            checked={newNote.isPublic}
                            onChange={(e) => {

                                setNewNote({...newNote, isPublic: e.target.checked, isEncrypted: false})
                            }}/>
                        <label>Public</label>
                        <input
                            type="checkbox"
                            checked={newNote.isEncrypted}
                            onChange={(e) => {
                                setNewNote({...newNote, isEncrypted: e.target.checked, isPublic: false})
                            }}
                        />
                        <label>Encrypted</label>
                    </div>
                    {message && <p className="error-message">{message}</p>}
                    <div className="markdown-output">
                        <h3>Markdown Preview</h3>
                        <ReactMarkdown className="markdown-content">{sanitizeMarkdown(newNote.text)}</ReactMarkdown>
                    </div>
                </div>
            )}

            <div className="notes-container">
                {notes.map((note) => (
                    <PrivateNote key={note.id} note={note} onDelete={handleDelete} onEdit={handleEdit}/>
                ))}
            </div>
        </div>
    );
};

export default PrivateNotesPage;
