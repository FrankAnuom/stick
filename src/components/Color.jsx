import React from 'react'
import { useContext } from 'react';
import { NoteContext } from '../context/NoteContext';
import { db } from '../appwrite/databases';

function Color({color}) {

  const {selectedNote, notes, setNotes} = useContext(NoteContext)
const changeColor = () => {
    try {
      const currentNoteIndex = notes.findIndex(
        (note) => note.$id === selectedNote.$id
      )

      const updatedNote = {
        ...notes[currentNoteIndex], 
        colors:JSON.stringify(color),
      };

      const newNotes = [...notes]
      newNotes[currentNoteIndex] = updatedNote
      setNotes(newNotes)
      db.notes.update(selectedNote.$id, {colors:JSON.stringify(color)})

    } catch (error) {
      alert ("Please, select a note before changing colors");
    }
}


  return (
    <div 
    className='color' 
    onClick={changeColor}
    style={{background:color.colorHeader}}
    >
      
    </div>
  )
}

export default Color