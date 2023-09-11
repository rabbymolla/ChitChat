import { Alert, Button } from "@mui/material";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { loginActiveChat } from "../../Features/Slice/ActiveChatSingle";
import "./style.css";

const MassageFriends = () => {
  const users = useSelector((user) => user.counter.value);
  const active = useSelector((user) => user.chta.active);
  const db = getDatabase();
  //friends list show
  const [massFrd, setMassFrd] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "friends/");
    onValue(starCountRef, (snapshot) => {
      const massFrdArry = [];
      snapshot.forEach((data) => {
        if (
          users.uid == data.val().clickUserId ||
          users.uid == data.val().loginId
        ) {
          massFrdArry.push({ ...data.val(), id: data.key });
        }
      });
      setMassFrd(massFrdArry);
    });
  }, []);

  // acctive single friends
  const dispatch = useDispatch();

  const handleChat = (data) => {
    if (data.clickUserId == users.uid) {
      dispatch(
        loginActiveChat({
          status: "Single",
          id: data.loginId,
          name: data.loginName,
          profile: data.curentProfile,
        })
      );
      localStorage.setItem("activeUsers", JSON.stringify(active));
    } else {
      dispatch(
        loginActiveChat({
          status: "Single",
          id: data.clickUserId,
          name: data.clickUser,
          profile: data.receverProfile,
        })
      );
      localStorage.setItem("activeUsers", JSON.stringify(active));
    }
  };

  // online show
  const [online, setOnline] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "Online/");
    onValue(starCountRef, (snapshot) => {
      const onlineArry = [];
      snapshot.forEach((data) => {
        if (
          users.uid == data.val().clickUserId ||
          users.uid == data.val().loginId
        ) {
          onlineArry.push(data.key);
        }
      });
      setOnline(onlineArry);
    });
  }, []);

  return (
    <>
      <section>
        <div className="group_box">
          <div className="group_list_hadding">
            <h1>Friends All</h1>
            <div className="user_search_box">
              <div className="seacrh_icon">
                <BsSearch />
              </div>
              <div className="seacrh_input">
                <input type="text" placeholder="Search...." />
              </div>
            </div>
            <HiOutlineDotsVertical />
          </div>
          <div className="masFrd_content">
            {massFrd.length == 0 ? (
              <Alert severity="info">No Friends List !</Alert>
            ) : (
              massFrd.map((item, i) => (
                <div className="group_items " key={i}>
                  <div className="masgrp_img">
                    <picture>
                      {users.uid == item.clickUserId ? (
                        <img
                          src={item.curentProfile || "./images/user.png"}
                          onError={(e) => {
                            e.target.src = "./images/user.png";
                          }}
                          alt="friend-1"
                        />
                      ) : (
                        <img
                          src={item.receverProfile || "./images/user.png"}
                          onError={(e) => {
                            e.target.src = "./images/user.png";
                          }}
                          alt="friend-1"
                        />
                      )}
                    </picture>
                  </div>

                  <div className="masgrp_text">
                    <h1>
                      {users.uid == item.clickUserId
                        ? item.loginName
                        : item.clickUser}
                    </h1>
                    {online.includes(active.id + users.uid) ? (
                      <p>online</p>
                    ) : (
                      <p>offline</p>
                    )}
                  </div>

                  <div className="masgrp_button">
                    <Button
                      variant="contained"
                      color="success"
                      className="group_button_area"
                      onClick={() => handleChat(item)}
                    >
                      Massage
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MassageFriends;
