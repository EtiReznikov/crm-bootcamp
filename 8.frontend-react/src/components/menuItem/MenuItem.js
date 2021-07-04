import React from 'react';
import Button from '../Button/Button';
import {
  BrowserRouter as
    Link
} from "react-router-dom";
function menuItem(props) {
  return <a href="#" class={props.classA}>
    <i class={props.classI}></i>
    <span class={props.classS}>{props.text}
    </span>
  </a>
}

export default menuItem;