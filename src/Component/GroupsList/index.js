import { Alert, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import "./style.css";
import GroupModal from "../Group Modal";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const GroupsList = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const db = getDatabase();
  const users = useSelector((user) => user.counter.value);

  // show your group list data
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "Groups/");
    onValue(starCountRef, (snapshot) => {
      const groupShowArry = [];
      snapshot.forEach((item) => {
        if (users.uid != item.val().adminId) {
          groupShowArry.push({ ...item.val(), id: item.key });
        }
      });
      setGroups(groupShowArry);
    });
  }, []);

  // group join  write data show
  const handlegroupJoin = (data) => {
    set(push(ref(db, "GroupJoin/")), {
      groupId: data.id,
      groupNmme: data.groupname,
      groupTag: data.groupTitle,
      adminId: data.adminId,
      adminName: data.adminName,
      userId: users.uid,
      userName: users.displayName,
    });
  };
  const [grpremove, setGrpRemove] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "GroupJoin/");
    onValue(starCountRef, (snapshot) => {
      const groupRemoveArry = [];
      snapshot.forEach((item) => {
        groupRemoveArry.push(item.val().userId + item.val().groupId);
      });
      setGrpRemove(groupRemoveArry);
    });
  }, []);
  // alrady group join
  const [YourGrp, setYourGrp] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "GroupMembers/");
    onValue(starCountRef, (snapshot) => {
      const YourGrpArry = [];
      snapshot.forEach((item) => {
        YourGrpArry.push(item.val().userId + item.val().groupId);
      });
      setYourGrp(YourGrpArry);
    });
  }, []);

  return (
    <>
      <section>
        <div className="group_box">
          <div className="group_list_hadding">
            <h1>Groups List</h1>
            <Button onClick={handleOpen} variant="contained">
              Create Groups
            </Button>
            <HiOutlineDotsVertical />
          </div>
          <div className="group_content">
            {groups.length == 0 ? (
              <Alert severity="info">Your Group List !</Alert>
            ) : (
              groups.map((item, i) => (
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
                    <p>{item.groupTitle}</p>
                  </div>
                  <div className=" group_button">
                    {YourGrp.includes(users.uid + item.id) ||
                    YourGrp.includes(item.id + users.uid) ? (
                      <Button
                        variant="contained"
                        color="success"
                        className="group_button_area"
                      >
                        Member
                      </Button>
                    ) : grpremove.includes(users.uid + item.id) ||
                      grpremove.includes(item.id + users.uid) ? (
                      <Button
                        variant="contained"
                        color="success"
                        className="group_button_area"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        className="group_button_area"
                        onClick={() => handlegroupJoin(item)}
                      >
                        join
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <GroupModal open={open} setOpen={setOpen} />
      </section>
    </>
  );
};

export default GroupsList;
