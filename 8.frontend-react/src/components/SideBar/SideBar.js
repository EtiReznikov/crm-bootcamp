import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'
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

import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle, FiUsers } from "react-icons/fi";
import { BiCalendar } from "react-icons/bi";


import './SideBar.scss';



function SideBar(props) {
  const location = useLocation();
  //create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(false);

  //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };


  return (
    <>
      <div id="header">
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
            //*TODO: changeLOGO
            <div className="logotext">
              <p>{menuCollapse ? "Logo" : "Big Logo"}</p>
            </div>
            <div className="closemenu" onClick={menuIconClick}>
              {menuCollapse ? (
                <FiArrowRightCircle />
              ) : (
                <FiArrowLeftCircle />
              )}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <MenuItem active={location.pathname === '/'} icon={<FiHome />}>
                Home
                <Link to="/" />
              </MenuItem>
              <MenuItem active={location.pathname === '/Users'} icon={<FiUsers />}>
                Users
                <Link to="/Users" />
              </MenuItem>
              <MenuItem active={location.pathname === '/Calendar'} icon={<BiCalendar />}>
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