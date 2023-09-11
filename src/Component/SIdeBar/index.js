import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";
import React from "react";
import { BsUpload } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUsers } from "../../Features/Slice/LoginSlice";
import ModalProfile from "../ModalPopUp";
import SidebarIcons from "./SidebarIcons";
import "./style.css";

const Sidebar = () => {
  const db = getDatabase();
  // rudex value profile name part start
  const users = useSelector((user) => user.counter.value);

  // rudex value profile name part end
  // log out part start
  const dispatch = useDispatch();
  const naviget = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("users");
        dispatch(loginUsers(null));
        naviget("/");
        remove(ref(db, "Online/" + users.uid));
      })
      .catch((error) => {
        console.log(error.code);
      });
  };
  // log out part end
  // profile click start
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  // profile click end
  return (
    <>
      <section id="sidebar">
        <div className="sidebar_items">
          <div className="slidebar_main">
            <div className="sidebar_profile">
              <picture>
                <img
                  src={users.photoURL || "./images/user.png"}
                  onError={(e) => {
                    e.target.src = "./images/user.png";
                  }}
                  alt="profile"
                />
              </picture>
              <div className="sidebar_overlay" onClick={handleOpen}>
                <div className="slider_uplode">
                  <BsUpload />
                </div>
              </div>
            </div>
            <div className="sidebar_name">
              <h1>{users.displayName}</h1>
            </div>
          </div>
          <div className="sidebar_icon">
            <SidebarIcons />
          </div>
          <div className="sidebar_logout">
            <div className="siderbar_logout" onClick={handleLogout}>
              <IoMdLogOut />
            </div>
          </div>
        </div>
      </section>
      <ModalProfile open={open} setOpen={setOpen} />
    </>
  );
};

export default Sidebar;
