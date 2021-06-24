import React from 'react';
// import MenuItem from '../menuItem/MenuItem'
function menu(props) {
let itemList=[];
props.items.forEach(element => {
  itemList.push(element)
});
    return <ul> {itemList} </ul>
}

export default menu;
