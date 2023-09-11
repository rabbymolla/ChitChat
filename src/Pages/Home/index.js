import { Grid } from "@mui/material";
import React from "react";
import Friend from "../../Component/Friend";
import FriendRequest from "../../Component/FriendRequest";
import Group from "../../Component/Group";
import GroupsList from "../../Component/GroupsList";
import Search from "../../Component/SearchBox";
import UserList from "../../Component/UserList";
import "./style.css";
import Block from "../../Component/Block";
const Home = () => {
  return (
    <>
      <section id="margin">
        <Grid container>
          <Grid item lg={4} className="spacing_left">
            <div className="search">
              <Search />
            </div>
            <div className="groups_list home_gap">
              <GroupsList />
            </div>
            <div className="friend_request home_gap">
              <FriendRequest />
            </div>
          </Grid>
          <Grid item lg={4} className="spacing_left">
            <div className="friend">
              <Friend />
            </div>
            <div className="group home_gap">
              <Group />
            </div>
          </Grid>
          <Grid item lg={4} className="spacing_left">
            <div className="user_list">
              <UserList />
            </div>
            <div className="block_list home_gap">
              <div className="user_list">
                <Block />
              </div>
            </div>
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default Home;
