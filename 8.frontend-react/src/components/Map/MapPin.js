import React from "react";

const MapPin = ({ color, text, tooltip, $hover }) => {
    const handleClick = () => {
        console.log(`You clicked on ${tooltip}`);
    };

    return (
        <div style={{ color: color }} className={$hover ? "circle hover" : "circle"} onClick={handleClick}>
            <i id="pin" className="fa fa-map-marker"></i>
            <span className="circleText" title={tooltip}>
                {text}
            </span>
        </div>
    );
};

export default MapPin;
