import { useRef, useEffect, useState } from "react";
import Trash from "../icons/Trash";

const NoteCard = ({ note }) => {
    const cardRef = useRef(null);
    const textAreaRef = useRef(null);
    
    const [position, setPosition] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const body = JSON.parse(note.body);

    let startPos = { x: 0, y: 0 };

    useEffect(() => {
        autoGrow();
    }, []);

    const autoGrow = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    };

    const startDrag = (e) => {
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
            }}
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
                ></textarea>
            </div>
        </div>
    );
};

export default NoteCard;
