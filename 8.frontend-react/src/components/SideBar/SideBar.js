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

import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle, FiPackage } from "react-icons/fi";
import { BiCalendar, BiRun } from "react-icons/bi";
import {GrMapLocation} from "react-icons/gr"
import {RiUserSettingsLine} from "react-icons/ri"
import { AiOutlineClockCircle } from "react-icons/ai";
import './SideBar.scss';

import logo from '../../Views/logo.png'



function SideBar(props) {
  let location = useLocation();
  //create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(false);

  //create a custom function that will change menu collapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };


  return (
    <>
      <div id="menu-wrapper">
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
            { //TODO: changeLOGO 
            }
            <div className="logo-text">
              <p>{menuCollapse ?
                <img id="logo" src={logo} alt="logo" /> :
                `Hello ${localStorage.getItem('user_name')}`}</p>
            </div>
            <div className="close-menu" onClick={menuIconClick}>
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
              <MenuItem active={location.pathname === '/clients'} icon={<BiRun />}>
                Clients
                <Link to="/clients" />
              </MenuItem>
              <MenuItem active={location.pathname === '/calendar'} icon={<BiCalendar />}>
                Calendar
                <Link to="/calendar" />
              </MenuItem>
              <MenuItem active={location.pathname === '/map'} icon={<GrMapLocation/>}>
                Map
                <Link to="/map" />
              </MenuItem>
              <MenuItem active={location.pathname === '/classes'} icon={<AiOutlineClockCircle />}>
                Classes
                <Link to="/classes" />
              </MenuItem>
              <MenuItem active={location.pathname === '/packages'} icon={<FiPackage />}>
              Packages
                <Link to="/packages" />
              </MenuItem>
              <MenuItem active={location.pathname === '/users'} icon={<RiUserSettingsLine />}>
                Users
                <Link to="/users" />
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