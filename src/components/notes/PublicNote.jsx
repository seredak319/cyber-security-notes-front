import React from 'react';
import ReactMarkdown from 'react-markdown';
import './PrivateNote.css';

const PublicNote = ({note}) => {

    return (
        <div className="private-note">
            {(
                <>
                    <h3>{note.title}</h3>
                    {/* Render Markdown content securely */}
                    <ReactMarkdown className="markdown-content">
                        {note.text}
                    </ReactMarkdown>
                </>
            )}
        </div>
    );
};

export default PublicNote;
