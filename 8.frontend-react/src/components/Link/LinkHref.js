import React from 'react';
import './LinkHref.scss'
function LinkHref(props) {
    return <a
        className="link"
        href={props.href}
        onClick={props.onClick}>{props.text}
    </a>
}

export default LinkHref;