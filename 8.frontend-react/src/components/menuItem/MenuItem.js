import React from 'react';
import Button from '../Button/Button';
import {
    BrowserRouter as 
    Link
  } from "react-router-dom";
function menuItem(props) {
    return <Link to={props.link}>
    <Button className={props.className} text={props.text} onClick={props.onClick}/>
    </Link> 
  
}

export default menuItem;