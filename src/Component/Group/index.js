import React, { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import { Alert, Button } from "@mui/material";
import { AiFillBackward } from "react-icons/ai";

const Group = () => {
  const db = getDatabase();
  const users = useSelector((user) => user.counter.value);

  // show your group list
  const [groupShow, setGroupShow] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "Groups/");
    onValue(starCountRef, (snapshot) => {
      const GroupListArry = [];
      snapshot.forEach((item) => {
        if (users.uid == item.val().adminId) {
          GroupListArry.push({ ...item.val(), id: item.key });
        }
      });
      setGroupShow(GroupListArry);
    });
  }, []);

  // join request checked
  const [groupReq, setGroupReq] = useState([]);
  const [back, setBack] = useState(false);

  const handleReqShow = (data) => {
    setBack(true);
    const starCountRef = ref(db, "GroupJoin/");
    onValue(starCountRef, (snapshot) => {
      const groupReqArry = [];
      snapshot.forEach((item) => {
        if (users.uid == item.val().adminId && item.val().groupId == data.id) {
          groupReqArry.push({ ...item.val(), id: item.key });
        }
      });
      setGroupReq(groupReqArry);
    });
  };
  // accept req part
  const handleAcceptGrp = (data) => {
    set(push(ref(db, "GroupMembers/")), {
      adminId: data.adminId,
      groupId: data.groupId,
      userId: data.userId,
      userName: data.userName,
      groupNmme: data.groupNmme,
      adminName: data.adminName,
    }).then(() => {
      remove(ref(db, "GroupJoin/" + data.id));
    });
  };
  // group member show
  const [member, setMember] = useState(false);
  const [memberShow, setMemberShow] = useState([]);

  const handleMemberShow = (data) => {
    setMember(true);
    const starCountRef = ref(db, "GroupMembers/");
    onValue(starCountRef, (snapshot) => {
      const MemArry = [];
      snapshot.forEach((item) => {
        if (users.uid == data.adminId && data.id == item.val().groupId) {
          MemArry.push({ ...item.val(), id: item.key });
        }
      });
      setMemberShow(MemArry);
    });
  };
  return (
    <>
      <section>
        <div className="group_box">
          {back ? (
            <div className="group_list_hadding">
              <h1>Groups Request</h1>
              <AiFillBackward onClick={() => setBack(false)} />
              <HiOutlineDotsVertical />
            </div>
          ) : member ? (
            <div className="group_list_hadding">
              <h1>Groups Member</h1>
              <AiFillBackward onClick={() => setMember(false)} />
              <HiOutlineDotsVertical />
            </div>
          ) : (
            <div className="group_list_hadding">
              <h1>My Groups</h1>
              <HiOutlineDotsVertical />
            </div>
          )}

          <div className="friend_list_content">
            {groupShow.length == 0 ? (
              <Alert severity="info">Please Create the Group!</Alert>
            ) : back ? (
              groupReq.length == 0 ? (
                <Alert severity="info">No Request Show!</Alert>
              ) : (
                groupReq.map((item, i) => (
                  <div className="group_items " key={i}>
                    <div className="group_img">
                      <picture>
                        <img src="./images/user.png" alt="friend-1" />
                      </picture>
                    </div>
                    <div className="group_text">
                      <h1>{item.userName}</h1>
                    </div>
                    <div className="friend_list_button">
                      <Button
                        variant="contained"
                        color="success"
                        className="friend_button_area"
                      >
                        Rejact
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        className="friend_button_area"
                        onClick={() => handleAcceptGrp(item)}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                ))
              )
            ) : member ? (
              memberShow.length == 0 ? (
                <Alert severity="info">No Group Member Show!</Alert>
              ) : (
                memberShow.map((item, i) => (
                  <div className="group_items " key={i}>
                    <div className="group_img">
                      <picture>
                        <img src="./images/user.png" alt="friend-1" />
                      </picture>
                    </div>
                    <div className="group_text">
                      <h1>{item.userName}</h1>
                    </div>
                    <div className="group_button">
                      <Button
                        variant="contained"
                        color="success"
                        className="friend_button_area"
                      >
                        Member
                      </Button>
                    </div>
                  </div>
                ))
              )
            ) : (
              groupShow.map((item, i) => (
                <div className="group_items " key={i}>
                  <div className="group_img">
                    <picture>
                      <img src="./images/user.png" alt="friend-1" />
                    </picture>
                  </div>
                  <div className="group_text">
                    <p className="admin">
                      Admin: <span className="color">{item.adminName}</span>
                    </p>
                    <h1>{item.groupname}</h1>
                    <p>{item.groupTitle}?</p>
                  </div>
                  <div className="friend_list_button">
                    <Button
                      variant="contained"
                      color="success"
                      className="friend_button_area"
                      onClick={() => handleMemberShow(item)}
                    >
                      Info
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      className="friend_button_area"
                      onClick={() => handleReqShow(item)}
                    >
                      Request
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

export default Group;
