import React from "react";
import AddButton from "./AddButton";
import colors from "../assets/colors.json";
import color from "./color";

const Controls = () => {
    return (
        <div id="controls">
            <AddButton />
            {colors.map((color) => (
                <color key={color.id} color={color} />
            ))}
        </div>
    );
};

export default Controls;
