import React from "react";
import "./ToggleButton.css";

const ToggleButton = ({isFeedOpen, toggleFeed}) => {
    return (
        <button
            className={`toggle-button-fixed ${isFeedOpen ? "open" : "closed"}`}
            onClick={toggleFeed}
            style={{
                left: isFeedOpen ? "470px" : "30px"
            }}
        >
            <span className="arrow">{isFeedOpen ? "←" : "→"}</span>
        </button>
    );
};

export default ToggleButton;