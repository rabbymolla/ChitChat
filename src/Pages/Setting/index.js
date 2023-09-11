import { Grid } from "@mui/material";
import React from "react";
import { BiHelpCircle } from "react-icons/bi";
import { HiKey } from "react-icons/hi";
import {
  MdDelete,
  MdDriveFileRenameOutline,
  MdOutlineDarkMode,
} from "react-icons/md";
import { useSelector } from "react-redux";
import NameModal from "../../Component/NameModal";
import "./style.css";

const Settings = () => {
  const users = useSelector((user) => user.counter.value);
  const handleOpen = () => setOpen(true);
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <section id="massagee">
        <Grid container>
          <Grid className="spacing_left" item lg={6}>
            <div className="info_box">
              <div className="info_items">
                <div className="info_hedding">
                  <h1>Profile Settings</h1>
                </div>
                <div className="info_profile">
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
                  </div>
                  <div className="info_profile_name">
                    <p>{users.displayName}</p>
                    <span>Stay home stay safe</span>
                  </div>
                </div>
                <div className="info_Edit">
                  <MdDriveFileRenameOutline />
                  <span onClick={handleOpen}>Edit Profile Name.</span>
                </div>
                <div className="info_Edit info_gap">
                  <BiHelpCircle />
                  <span>Help.</span>
                </div>
              </div>
            </div>
          </Grid>
          <Grid className="spacing_left" item lg={6}>
            <div className="info_box">
              <div className="account_items">
                <div className="info_hedding">
                  <h1>Account Settings</h1>
                </div>
                <div className="info_account">
                  <div className="info_Edit">
                    <HiKey />
                    <span>Change Password.</span>
                  </div>
                  <div className="info_Edit info_gap">
                    <MdOutlineDarkMode />
                    <span>Theme.</span>
                  </div>
                  <div className="info_Edit info_gap">
                    <MdDelete />
                    <span>Delete Account.</span>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <NameModal open={open} setOpen={setOpen} />
      </section>
    </>
  );
};

export default Settings;
