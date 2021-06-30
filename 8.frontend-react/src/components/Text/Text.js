import React from 'react';
import './Text.scss'
function Text(props) {
    return    <div className={props.className}>  {props.text} </div>

}

export default Text;