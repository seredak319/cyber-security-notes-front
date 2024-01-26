import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './PrivateNote.css';
import {notesApi} from "../../api/notesApi";
import {useSelector} from "react-redux";

const PrivateNote = ({ note, onDelete, onEdit}) => {
    const [isEncrypted, setIsEncrypted] = useState(note.isEncrypted);
    const [password, setPassword] = useState('');
    const [editMode, setEditMode] = useState(false);
    const accessToken = useSelector((state) => state.auth.accessToken);
    const [text, setText] = useState(note.text)

    let {id} = note

    const handleDecode = async (id, password) => {
        try {
            if (accessToken) {
                let response = await notesApi.decrypt(id, password, accessToken)
                setText(response.text)
            }
        } catch (error) {
            console.error('Error deleting notes', error);
        }
    };

    return (
        <div className="private-note">
            {(
                <>
                    <h3>{note.title}</h3>
                    <ReactMarkdown className="markdown-content">
                        {text}
                    </ReactMarkdown>
                    <button className="btn2" onClick={() => setEditMode(true)}>Edit</button>
                    <button className="btn2" onClick={() => onDelete(id)}>Delete</button>
                    {isEncrypted && (
                            <input
                                style={{marginRight: "3px"}}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                            />
                    )}
                    {isEncrypted && <button className="btn2" onClick={()=> handleDecode(id, password)}>Decode</button>}
                </>
            ) }
        </div>
    );
};

export default PrivateNote;
