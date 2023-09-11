import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsFillChatDotsFill } from "react-icons/bs";
import { IoMdNotifications } from "react-icons/io";
import { RxGear } from "react-icons/rx";
import { NavLink } from "react-router-dom";

const SidebarIcons = () => {
  return (
    <>
      <section>
        <div className="sidebar_gap">
          <NavLink to="/" className="siderbar_manu_icons">
            <AiOutlineHome />
          </NavLink>
        </div>
        <div className="sidebar_gap">
          <NavLink to="/message" className="siderbar_manu_icons">
            <BsFillChatDotsFill />
          </NavLink>
        </div>
        <div className="sidebar_gap">
          <NavLink to="/notification" className="siderbar_manu_icons">
            <IoMdNotifications />
          </NavLink>
        </div>
        <div>
          <NavLink to="/setting" className="siderbar_manu_icons">
            <RxGear />
          </NavLink>
        </div>
      </section>
    </>
  );
};

export default SidebarIcons;
