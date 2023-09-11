import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import "./style.css";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";

const Friend = () => {
  const users = useSelector((user) => user.counter.value);
  const db = getDatabase();
  // show your friend list
  const [friendShow, setfriendShow] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "friends/");
    onValue(starCountRef, (snapshot) => {
      const firendArry = [];
      snapshot.forEach((data) => {
        if (
          users.uid == data.val().clickUserId ||
          users.uid == data.val().loginId
        ) {
          firendArry.push({ ...data.val(), id: data.key });
        }
      });
      setfriendShow(firendArry);
    });
  }, []);

  // unFriend your friend
  const handleUnfriend = (data) => {
    remove(ref(db, "friends/" + data.id));
  };

  // block Your frend
  const handleBlock = (data) => {
    if (users.uid == data.loginId) {
      set(push(ref(db, "Blocks/")), {
        blockDece: data.loginName,
        blockDeceId: data.loginId,
        blockKyce: data.clickUser,
        blockKyceId: data.clickUserId,
        blockKyceProfile: data.receverProfile,
      }).then(() => {
        remove(ref(db, "friends/" + data.id));
      });
    } else {
      set(push(ref(db, "Blocks/")), {
        blockDece: data.clickUser,
        blockDeceId: data.clickUserId,
        blockKyce: data.loginName,
        blockKyceId: data.loginId,

        usersProfile: data.curentProfile,
      }).then(() => {
        remove(ref(db, "friends/" + data.id));
      });
    }
  };

  return (
    <>
      <section>
        <div className="group_box">
          <div className="group_list_hadding">
            <h1>Friends</h1>
            <HiOutlineDotsVertical />
          </div>
          <div className="friend_list_content">
            {friendShow.map((item, i) => (
              <div className="group_items " key={i}>
                <div className="group_img">
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
                <div className="group_text">
                  <h1>
                    {users.uid == item.clickUserId
                      ? item.loginName
                      : item.clickUser}
                  </h1>
                  <p>Dinner?</p>
                </div>
                <div className="friend_button">
                  <Button
                    variant="contained"
                    color="success"
                    className="friend_button_area"
                    onClick={() => handleBlock(item)}
                  >
                    Block
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    className="friend_button_area"
                    onClick={() => handleUnfriend(item)}
                  >
                    Unfriend
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

export default Friend;
