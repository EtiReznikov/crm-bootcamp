import './Headline.scss'
import React from 'react';

function Headline(props) {
    return    <div id={props.id} className={props.className}>{props.text}</div>
}

export default Headline;