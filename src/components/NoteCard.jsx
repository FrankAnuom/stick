import { useRef, useEffect, useState } from "react";
import { db } from "../appwrite/databases";
import DeleteButton from "./DeleteButton";
import { bodyParser, setNewOffset } from "../utils";
import Spinner from "../icons/spinner";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import { getDeviceId } from "../utils"; // <-- Ensure deviceId is available

let globalZIndex = 1; // Global counter to track zIndex

const NoteCard = ({ note }) => {
  const cardRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const keyUpTimer = useRef(null);
  const textAreaRef = useRef(null);

  const { setSelectedNote } = useContext(NoteContext);

  const [position, setPosition] = useState(JSON.parse(note.position));
  const colors = JSON.parse(note.colors);
  const [body, setBody] = useState(bodyParser(note.body)); // Track text content as state
  const [zIndex, setZIndex] = useState(globalZIndex);

  const startPos = useRef({ x: 0, y: 0 });
  const cardSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus(); // Autofocus on mount
    }
    autoGrow();
    bringToFront();
  }, []);

  const autoGrow = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  };

  const bringToFront = () => {
    globalZIndex += 1; // Increase global zIndex
    setZIndex(globalZIndex); // Set the highest zIndex for this card
  };

  const startDrag = (e) => {
    bringToFront(); // Bring the card to the front when dragging

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    startPos.current = { x: clientX, y: clientY };

    const card = cardRef.current;
    if (card) {
      cardSizeRef.current = {
        width: card.offsetWidth,
        height: card.offsetHeight,
      };
    }

    if (e.touches) {
      // Prevent scrolling behavior on mobile
      document.addEventListener("touchmove", drag, { passive: false });
      document.addEventListener("touchend", stopDrag);
    } else {
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDrag);
    }
  };

  const drag = (e) => {
    e.preventDefault(); // Prevent scrolling on mobile

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const moveX = clientX - startPos.current.x;
    const moveY = clientY - startPos.current.y;

    startPos.current = { x: clientX, y: clientY };
    setSelectedNote(note);

    setPosition((prev) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const cardWidth = cardSizeRef.current.width;
      const cardHeight = cardSizeRef.current.height;

      // Ensure the card is within screen bounds
      const newX = Math.max(
        0,
        Math.min(prev.x + moveX, screenWidth - cardWidth)
      );
      const newY = Math.max(
        0,
        Math.min(prev.y + moveY, screenHeight - cardHeight)
      );

      return {
        x: newX,
        y: newY,
      };
    });
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);

    document.removeEventListener("touchmove", drag);
    document.removeEventListener("touchend", stopDrag);

    // Save the new position to the database after drag ends
    const newPosition = { x: position.x, y: position.y };
    saveData("position", newPosition);
    db.notes.update(note.$id, { position: JSON.stringify(newPosition) }).then(
      () => {
        console.log("Position saved successfully");
      },
      (error) => {
        console.error("Error saving position:", error);
      }
    );
  };

  // Function to save data (position or body) to the database
  const saveData = async (key, value) => {
    const payload = { [key]: JSON.stringify(value), deviceId: getDeviceId() };

    try {
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.error("Error saving data:", error);
    }
    setSaving(false);
  };

  // Handle text area changes and update body and database
  const handleChange = (e) => {
    const newBody = e.target.value;
    setBody(newBody); // Update the state with the new body text

    // Update the database with the new body content
    saveData("body", newBody);
  };

  const handleKeyUp = () => {
    setSaving(true);

    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }

    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 2000);
  };

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: colors.colorBody,
        zIndex: zIndex,
        position: "absolute",
      }}
      onMouseDown={bringToFront} // Bring card to front when clicked
    >
      <div
        onMouseDown={startDrag} // For desktops/laptops
        onTouchStart={startDrag} // For mobile devices
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
      >
        <DeleteButton noteId={note.$id} />

        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
      </div>

      <div className="card-body">
        <textarea
          onKeyUp={handleKeyUp}
          ref={textAreaRef}
          style={{ color: colors.colorText }}
          value={body} // Bind the text area value to the state
          onChange={handleChange} // Update state and database on text change
          onInput={autoGrow}
          onFocus={() => {
            bringToFront;
            setSelectedNote;
          }} // Bring to front when typing
        ></textarea>
      </div>
    </div>
  );
};

export default NoteCard;
