import React from "react";
import {fakeData as note} from '../assets/fakeData'
import NoteCard from '../components/NoteCard'

const NotesPage = () => {
  return <div>
    {note.map(note =>(
      <NoteCard key={note.$id} note={note}/>
    ))}
  </div>;
};

export default NotesPage;
