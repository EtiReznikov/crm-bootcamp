import React, { useState } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import {
  Link,
  useLocation
} from "react-router-dom";

import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { BiCalendar, BiRun } from "react-icons/bi";
import { FaUserCog } from "react-icons/fa";
import { CgGym } from "react-icons/cg";
import {AiOutlineClockCircle} from "react-icons/ai";
import './SideBar.scss';

import logo from '../../Views/Daco_6140061.png'



function SideBar(props) {
  let location = useLocation();
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
            { //TODO: changeLOGO 
            }
            <div className="logotext">
              <p>{menuCollapse ?
                <img id="logo" src={logo} alt="logo" /> :
                `Hello ${localStorage.getItem('user_name')}`}</p>
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
              <MenuItem active={location.pathname === '/Clients'} icon={<BiRun />}>
                Clients
                <Link to="/Clients" />
              </MenuItem>
              <MenuItem active={location.pathname === '/Users'} icon={<FaUserCog />}>
                Users
                <Link to="/Users" />
              </MenuItem>
              <MenuItem active={location.pathname === '/Calendar'} icon={<BiCalendar />}>
                Calendar
                <Link to="/Calendar" />
              </MenuItem>
              <MenuItem active={location.pathname === '/Classes'} icon={<AiOutlineClockCircle />}>
              Classes
              <Link to="/Classes" />
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