import { Button } from "@mui/material";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { loginActiveChat } from "../../Features/Slice/ActiveChatSingle";
import "./style.css";

const MassageGroup = () => {
  // all group show
  const users = useSelector((user) => user.counter.value);
  const db = getDatabase();

  const [masGrp, setMasGrp] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "Groups/");
    onValue(starCountRef, (snapshot) => {
      const MassGrpArry = [];
      snapshot.forEach((data) => {
        MassGrpArry.push({ ...data.val(), id: data.key });
      });
      setMasGrp(MassGrpArry);
    });
  }, []);
  // Massage Group seach show
  const [masGrpSearch, setMasGrpSearch] = useState([]);
  const handleMasGrp = (e) => {
    const masGrpSrcArry = [];
    masGrp.filter((data) => {
      if (data.groupname.toLowerCase().includes(e.target.value.toLowerCase())) {
        masGrpSrcArry.push(data);
        setMasGrpSearch(masGrpSrcArry);
      }
    });
  };
  // group send massage
  const active = useSelector((user) => user.chta.active);
  const dispatch = useDispatch();
  const handleSendGrp = (data) => {
    dispatch(
      loginActiveChat({
        status: "group",
        id: data.id,
        name: data.groupname,
        adminId: data.adminId,
      })
    )
    localStorage.setItem("activeUsers", JSON.stringify(active));
  };
  return (
    <>
      <section>
        <div className="group_box">
          <div className="group_list_hadding">
            <h1>Groups</h1>
            <div className="user_search_box">
              <div className="seacrh_icon">
                <BsSearch />
              </div>
              <div className="seacrh_input">
                <input
                  onChange={handleMasGrp}
                  type="text"
                  placeholder="Search...."
                />
              </div>
            </div>
            <HiOutlineDotsVertical />
          </div>
          <div className="masgrp_content">
            {masGrpSearch.length > 0
              ? masGrpSearch.map((item, i) => (
                  <div className="group_items " key={i}>
                    <div className="masgrp_img">
                      <picture>
                        <img src="./images/user.png" alt="friend-1" />
                      </picture>
                    </div>

                    <div className="masgrp_text">
                      <span>Admin: {item.adminName}</span>
                      <h1>{item.groupname}</h1>
                      <p>{item.groupTitle}?</p>
                    </div>

                    <div className="masgrp_button">
                      <Button
                        variant="contained"
                        color="success"
                        className="group_button_area"
                        onClick={() => handleSendGrp(item)}
                      >
                        Massage
                      </Button>
                    </div>
                  </div>
                ))
              : masGrp.map((item, i) => (
                  <div className="group_items " key={i}>
                    <div className="masgrp_img">
                      <picture>
                        <img src="./images/user.png" alt="friend-1" />
                      </picture>
                    </div>

                    <div className="masgrp_text">
                      <span>Admin: {item.adminName}</span>
                      <h1>{item.groupname}</h1>
                      <p>{item.groupTitle}?</p>
                    </div>

                    <div className="masgrp_button">
                      <Button
                        variant="contained"
                        color="success"
                        className="group_button_area"
                        onClick={() => handleSendGrp(item)}
                      >
                        Massage
                      </Button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MassageGroup;
