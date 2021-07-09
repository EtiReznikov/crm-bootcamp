import React from 'react';
import './LinkHref.scss'

function LinkHref(props) {
    return <a
        className={props.className}
        href={props.href}
        onClick={props.onClick}>{props.text}
    </a>
}

export default LinkHref;