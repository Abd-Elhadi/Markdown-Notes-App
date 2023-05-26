import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    const [notes, setNotes] = React.useState(() => JSON.parse(window.localStorage.getItem('notes')) || [])
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )


    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        setNotes(oldNotes => {
            let idx;
            let updatedNote;
            const updatedNotes = oldNotes.map((oldNote, index) => {
                if (oldNote.id === currentNoteId) {
                    oldNote.body = text;
                    updatedNote = oldNote;
                    idx = index;
                    return oldNote
                }
                return oldNote;
            });
            updatedNotes.splice(idx, 1);
            updatedNotes.unshift(updatedNote);
            return updatedNotes;
        });
        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //     if (oldNote.id === currentNoteId) {
        //         const newNote = oldNote;
        //         newNote.body = text;
        //         return newNote;
        //     }
        //     return oldNote;
        // }));
    }

    function deleteNote(event, noteId) {
        event.stopPropagation();
        setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
