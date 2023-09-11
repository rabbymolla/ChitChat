import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import "./style.css";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";

const FriendRequest = () => {
  const users = useSelector((user) => user.counter.value);
  const db = getDatabase();

  // show your request
  const [showReq, setShowReq] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "friendRequest/");
    onValue(starCountRef, (snapshot) => {
      const reqArry = [];
      snapshot.forEach((data) => {
        if (users.uid == data.val().clickUserId) {
          reqArry.push({ ...data.val(), id: data.key });
        }
      });
      setShowReq(reqArry);
    });
  }, []);

  // Accept your req
  const handleAccept = (data) => {
    set(push(ref(db, "friends/")), {
      ...data,
    }).then(() => {
      remove(ref(db, "friendRequest/" + data.id));
    });
  };

  // reject your friends
  const handleDelete = (data) => {
    remove(ref(db, "friendRequest/" + data.id));
  };

  return (
    <>
      <section>
        <div className="group_box">
          <div className="group_list_hadding">
            <h1>Friend Request</h1>
            <HiOutlineDotsVertical />
          </div>
          <div className="friend_content">
            {showReq.map((item, i) => (
              <div className="group_items " key={i}>
                <div className="group_img">
                  <picture>
                    <img
                      src={item.curentProfile || "./images/user.png"}
                      onError={(e) => {
                        e.target.src = "./images/user.png";
                      }}
                      alt="friend-1"
                    />
                  </picture>
                </div>
                <div className="friend_text">
                  <h1>{item.loginName}</h1>
                  <p>Dinner?</p>
                </div>
                <div className="friend_button">
                  <Button
                    variant="contained"
                    color="success"
                    className="friend_button_area"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    className="friend_button_area"
                    onClick={() => handleAccept(item)}
                  >
                    Accept
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

export default FriendRequest;
