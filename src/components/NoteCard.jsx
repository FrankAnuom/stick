import { useRef, useEffect, useState } from "react";
import Trash from "../icons/Trash";

let globalZIndex = 1; // Global counter to track zIndex

const NoteCard = ({ note }) => {
    const cardRef = useRef(null);
    const textAreaRef = useRef(null);
    
    const [position, setPosition] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const body = JSON.parse(note.body);
    const [zIndex, setZIndex] = useState(globalZIndex);

    let startPos = { x: 0, y: 0 };

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
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
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

        startPos.x = clientX;
        startPos.y = clientY;

        if (e.touches) {
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

        const moveX = clientX - startPos.x;
        const moveY = clientY - startPos.y;

        startPos.x = clientX;
        startPos.y = clientY;

        setPosition((prev) => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const cardWidth = cardRef.current.offsetWidth;
            const cardHeight = cardRef.current.offsetHeight;

            return {
                x: Math.max(0, Math.min(prev.x + moveX, screenWidth - cardWidth)),
                y: Math.max(0, Math.min(prev.y + moveY, screenHeight - cardHeight)),
            };
        });
    };

    const stopDrag = () => {
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDrag);

        document.removeEventListener("touchmove", drag);
        document.removeEventListener("touchend", stopDrag);
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
                position: "absolute"
            }}
            onMouseDown={bringToFront} // Bring card to front when clicked
        >
            <div
                onMouseDown={startDrag} // For desktops/laptops
                onTouchStart={startDrag} // For mobile devices
                className="card-header"
                style={{ backgroundColor: colors.colorHeader }}
            >
                <Trash />
            </div>

            <div className="card-body">
                <textarea
                    ref={textAreaRef}
                    style={{ color: colors.colorText }}
                    defaultValue={body}
                    onInput={autoGrow}
                    onFocus={bringToFront} // Bring to front when typing
                ></textarea>
            </div>
        </div>
    );
};

export default NoteCard;