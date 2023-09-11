import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { HiDotsVertical, HiOutlineDotsVertical } from "react-icons/hi";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import { BsSearch } from "react-icons/bs";
import "./style.css";

const UserList = () => {
  const users = useSelector((user) => user.counter.value);
  const db = getDatabase();
  const storage = getStorage();

  // show your users photo
  const [userShow, setUserShow] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "users");
    onValue(starCountRef, (snapshot) => {
      const photoArry = [];
      snapshot.forEach((item) => {
        if (users.uid !== item.key) {
          getDownloadURL(storageRef(storage, item.key))
            .then((url) => {
              photoArry.push({
                ...item.val(),
                id: item.key,
                profilepicture: url,
              });
            })
            .catch((error) => {
              photoArry.push({
                ...item.val(),
                id: item.key,
                profilepicture: null,
              });
            })
            .then(() => {
              setUserShow([...photoArry]);
            });
        }
      });
    });
  }, []);

  // sent your friend request
  const handleAddFriend = (show) => {
    set(push(ref(db, "friendRequest/")), {
      loginName: users.displayName,
      loginId: users.uid,
      clickUser: show.username,
      clickUserId: show.id,
      curentProfile: users.photoURL || "./images/user.png",
      receverProfile: show.profilepicture || "./images/user.png",
    });
  };
  // friend button show
  const [firBtn, setfirBtn] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "friends/");
    onValue(starCountRef, (snapshot) => {
      const firBtnArry = [];
      // const firBtnShowArry = [];
      snapshot.forEach((data) => {
        firBtnArry.push(data.val().loginId + data.val().clickUserId);
      });
      setfirBtn(firBtnArry);
    });
  }, []);

  // block buttom show
  const [blockBtn, setBlockBtn] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "Blocks/");
    onValue(starCountRef, (snapshot) => {
      const blockBtnArry = [];
      snapshot.forEach((item) => {
        blockBtnArry.push(item.val().blockDeceId + item.val().blockKyceId);
      });
      setBlockBtn(blockBtnArry);
    });
  }, []);
  // cnacle Request
  const [cancle, setCancle] = useState([]);
  const [cancleReq, setCancleReq] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "friendRequest/");
    onValue(starCountRef, (snapshot) => {
      const cancleArry = [];
      const cancleBtnArry = [];
      snapshot.forEach((data) => {
        cancleArry.push(data.val().loginId + data.val().clickUserId);
        cancleBtnArry.push({ ...data.val(), id: data.key });
      });
      setCancle(cancleArry);
      setCancleReq(cancleBtnArry);
    });
  }, []);
  // request remove your friends

  const handleRemove = (data) => {
    cancleReq.map((item) => {
      if (data.id == item.clickUserId || data.id == item.loginId) {
        remove(ref(db, "friendRequest/" + item.id));
      }
    });
  };

  // search area part start
  const [filterUser, setFilterUser] = useState([]);
  const handleSearch = (e) => {
    const srcArry = [];
    userShow.filter((data) => {
      if (data.username.toLowerCase().includes(e.target.value.toLowerCase())) {
        srcArry.push(data);
        setFilterUser(srcArry);
      }
    });
  };

  return (
    <>
      <section>
        <div className="group_box">
          <div className="group_list_hadding">
            <h1>User List</h1>
            <div className="user_search_box">
              <div className="seacrh_icon">
                <BsSearch />
              </div>
              <div className="seacrh_input">
                <input
                  onChange={handleSearch}
                  type="text"
                  placeholder="Search...."
                />
              </div>
            </div>
            <HiOutlineDotsVertical />
          </div>
          <div className="user_list_content">
            {filterUser.length > 0
              ? filterUser.map((list, i) => (
                  <div className="group_items " key={i}>
                    <div className="group_img">
                      <picture>
                        <img
                          src={list.profilepicture || "./images/user.png"}
                          onError={(e) => {
                            e.target.src = "./images/user.png";
                          }}
                          alt=""
                        />
                      </picture>
                    </div>

                    <div className="group_text">
                      <h1>{list.username}</h1>
                      <p>Dinner?</p>
                    </div>

                    <div className="friend_button">
                      {blockBtn.includes(list.id + users.uid) ||
                      blockBtn.includes(users.uid + list.id) ? (
                        <p className="blocked">Blocked</p>
                      ) : firBtn.includes(list.id + users.uid) ||
                        firBtn.includes(users.uid + list.id) ? (
                        <Button
                          variant="contained"
                          color="success"
                          className="group_button_area"
                        >
                          Friend
                        </Button>
                      ) : cancle.includes(list.id + users.uid) ||
                        cancle.includes(users.uid + list.id) ? (
                        <Button
                          variant="contained"
                          color="success"
                          className="group_button_area"
                          onClick={() => handleRemove(list)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          className="group_button_area"
                          onClick={() => handleAddFriend(list)}
                        >
                          Add Friend
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              : userShow.map((list, i) => (
                  <div className="group_items " key={i}>
                    <div className="group_img">
                      <picture>
                        <img
                          src={list.profilepicture || "./images/user.png"}
                          onError={(e) => {
                            e.target.src = "./images/user.png";
                          }}
                          alt=""
                        />
                      </picture>
                    </div>

                    <div className="group_text">
                      <h1>{list.username}</h1>
                      <p>Dinner?</p>
                    </div>

                    <div className="friend_button">
                      {blockBtn.includes(list.id + users.uid) ||
                      blockBtn.includes(users.uid + list.id) ? (
                        <p className="blocked">Blocked</p>
                      ) : firBtn.includes(list.id + users.uid) ||
                        firBtn.includes(users.uid + list.id) ? (
                        <Button
                          variant="contained"
                          color="success"
                          className="group_button_area"
                        >
                          Friend
                        </Button>
                      ) : cancle.includes(list.id + users.uid) ||
                        cancle.includes(users.uid + list.id) ? (
                        <Button
                          variant="contained"
                          color="success"
                          className="group_button_area"
                          onClick={() => handleRemove(list)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          className="group_button_area"
                          onClick={() => handleAddFriend(list)}
                        >
                          Add Friend
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default UserList;
