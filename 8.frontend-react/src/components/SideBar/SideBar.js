import React, { useState, useEffect } from "react";

//import react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
//import icons from react icons

import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle, FiUsers} from "react-icons/fi";
import { BiCalendar } from "react-icons/bi";


import './SideBar.scss';


function SideBar(props) {
  //create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(false);
  const [isActive, setIsActive] = useState({
    home : true,
    users: false,
    calendar: false
  }
  );

  // useEffect(() => {

  // });
  

  
  const changeActive =  (chosen) => {
    // var newIsActive = isActive;
    
    // for (const key in newIsActive){
    //   newIsActive[key] = false;
    // }
    // newIsActive[chosen] = true;
    //  console.log(newIsActive);
  }


  //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  
  return (
    <>
      <div id="header">
        {/* collapsed props to change menu size using menucollapse state */}
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
            <div className="logotext">
              {/* small and big change using menucollapse state */}
              <p>{menuCollapse ? "Logo" : "Big Logo"}</p>
            </div>
            <div className="closemenu" onClick={menuIconClick}>
              {/* changing menu collapse icon on click */}
              {menuCollapse ? (
                <FiArrowRightCircle />
              ) : (
                <FiArrowLeftCircle />
              )}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <MenuItem active={isActive.home} icon={<FiHome />} onClick={changeActive('home')}>
                Home
                <Link to="/" />
              </MenuItem>
              <MenuItem active={isActive.users} icon={<FiUsers/>} onClick={changeActive('users')}>
                Users
                <Link to="/Users" />
              </MenuItem>
              <MenuItem active={isActive.calendar} icon={<BiCalendar/>} onClick={changeActive('calendar')}>
                Calendar
                <Link to="/Calendar" />
                </MenuItem>
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="square">
              <MenuItem icon={<FiLogOut />} onClick={props.logout}>Logout</MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </>
  );
};

export default SideBar;