import { Button } from "@mui/material";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useSelector } from "react-redux";
import "./style.css";

const Block = () => {
  const db = getDatabase();
  const users = useSelector((user) => user.counter.value);
  // block show your friends
  const [block, setBlock] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "Blocks/");
    onValue(starCountRef, (snapshot) => {
      const blockArry = [];
      snapshot.forEach((item) => {
        if (users.uid == item.val().blockDeceId) {
          blockArry.push({ ...item.val(), id: item.key });
        }
      });
      setBlock(blockArry);
    });
  }, []);

  //   unblock your friends
  const handleUnbock = (data) => {
    set(push(ref(db, "friends/")), {
      loginName: users.displayName,
      loginId: users.uid,
      clickUser: data.blockKyce,
      clickUserId: data.blockKyceId,
    }).then(() => {
      remove(ref(db, "Blocks/" + data.id));
    });
  };

  return (
    <>
      <section>
        <div className="group_box">
          <div className="group_list_hadding">
            <h1>Block List</h1>
            <HiOutlineDotsVertical />
          </div>
          <div className="friend_list_content">
            {block.map((item, i) => (
              <div className="group_items " key={i}>
                <div className="group_img">
                  <picture>
                    {users.uid == item.blockDeceId ? (
                      <img
                        src={item.blockKyceProfile || "./images/user.png"}
                        onError={(e) => {
                          e.target.src = "./images/user.png";
                        }}
                        alt="friend-1"
                      />
                    ) : (
                      <img
                        src={item.usersProfile || "./images/user.png"}
                        onError={(e) => {
                          e.target.src = "./images/user.png";
                        }}
                        alt="friend-1"
                      />
                    )}
                  </picture>
                </div>

                <div className="group_text">
                  <h1>{item.blockKyce}</h1>
                  <p>Dinner?</p>
                </div>
                <div className="friend_button">
                  <Button
                    variant="contained"
                    color="success"
                    className="group_button_area"
                    onClick={() => handleUnbock(item)}
                  >
                    UnBlock
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

export default Block;
