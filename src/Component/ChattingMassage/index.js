import { Alert } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as sref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import moment from "moment/moment";
import React, { useEffect, useRef, useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { AiFillCamera } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import { GrClose, GrGallery } from "react-icons/gr";
import { HiPlus } from "react-icons/hi";
import { RiSendPlaneFill } from "react-icons/ri";
import ModalImage from "react-modal-image";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import "./style.css";

const ChattingMassage = () => {
  const users = useSelector((user) => user.counter.value);
  const active = useSelector((user) => user.chta.active);
  const db = getDatabase();
  const [open, setOpen] = useState(false);
  // camera capture part
  const [openCam, setOpenCam] = useState(false);
  const [captureImg, setCaptuerImg] = useState("");

  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    setCaptuerImg(dataUri);
    const storageRef = sref(storage, uuidv4());
    uploadString(storageRef, dataUri, "data_url").then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        set(push(ref(db, "singleMassage/")), {
          senderId: users.uid,
          senderName: users.displayName,
          receverId: active.id,
          receverName: active.name,
          myCamImg: downloadURL,
          date: `${new Date().getFullYear()} - ${
            new Date().getMonth() + 1
          }- ${new Date().getDate()}, ${new Date().getHours()} : ${new Date().getMinutes()}`,
        }).then(() => {
          setOpenCam(false);
        });
      });
    });
  }

  // gallery part stat
  const choseFile = useRef(null);
  // send single massage
  const [mass, setMass] = useState("");
  const handleMassSend = () => {
    if (active.status == "Single") {
      set(push(ref(db, "singleMassage/")), {
        senderId: users.uid,
        senderName: users.displayName,
        receverId: active.id,
        receverName: active.name,
        myMass: mass,
        date: `${new Date().getFullYear()} - ${
          new Date().getMonth() + 1
        }- ${new Date().getDate()}, ${new Date().getHours()} : ${new Date().getMinutes()}`,
      }).then(() => {
        setOpenEmoji(false);
        setMass("");
      });
    } else {
      set(push(ref(db, "GroupMassage/")), {
        senderId: users.uid,
        senderName: users.displayName,
        receverId: active.id,
        receverName: active.name,
        adminId: active.adminId,
        myMass: mass,
        date: `${new Date().getFullYear()} - ${
          new Date().getMonth() + 1
        }- ${new Date().getDate()}, ${new Date().getHours()} : ${new Date().getMinutes()}`,
      }).then(() => {
        setOpenEmoji(false);
        setMass("");
      });
    }
  };

  const handleEnter = (e) => {
    if (e.key == "Enter") {
      handleMassSend();
      handleAudioFUpload();
      handleEmoji();
    }
  };
  // show YOUR single massage
  const [massList, setMassList] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "singleMassage/");
    onValue(starCountRef, (snapshot) => {
      const singleArry = [];
      snapshot.forEach((data) => {
        if (
          (data.val().senderId == users.uid &&
            data.val().receverId == active.id) ||
          (data.val().receverId == users.uid &&
            data.val().senderId == active.id)
        ) {
          singleArry.push(data.val());
        }
      });
      setMassList(singleArry);
    });
  }, [active.id]);

  // show YOUR group massage
  const [grpMassList, setGrpMassList] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "GroupMassage/");
    onValue(starCountRef, (snapshot) => {
      const grpMassArry = [];
      snapshot.forEach((data) => {
        grpMassArry.push(data.val());
      });
      setGrpMassList(grpMassArry);
    });
  }, [active.id]);

  // show YOUR all group member massage
  const [grpMassMemList, setGrpMassMEmList] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "GroupMembers/");
    onValue(starCountRef, (snapshot) => {
      const grpMassMemArry = [];
      snapshot.forEach((data) => {
        grpMassMemArry.push(data.val().groupId + data.val().userId);
      });

      setGrpMassMEmList(grpMassMemArry);
    });
  }, []);

  // file upload area
  const storage = getStorage();

  const handleImageUpload = (e) => {
    const gallvalue = e.target.files[0].name;
    const filevalue = e.target.files[0];
    const storageRef = sref(storage, uuidv4());
    const uploadTask = uploadBytesResumable(storageRef, filevalue);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          set(push(ref(db, "singleMassage/")), {
            senderId: users.uid,
            senderName: users.displayName,
            receverId: active.id,
            receverName: active.name,
            myImg: downloadURL,
            date: `${new Date().getFullYear()} - ${
              new Date().getMonth() + 1
            }- ${new Date().getDate()}, ${new Date().getHours()} : ${new Date().getMinutes()}`,
          });
        });
      }
    );
  };
  // voice part area
  const [blobOpen, setBlobOpen] = useState(true);
  const [audioUrl, setAudioUrl] = useState();
  const [blob, setBolb] = useState();

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setBolb(blob);
    // const audio = document.createElement("audio");
    // audio.src = url;
    // audio.controls = true;
    // document.body.appendChild(audio);
  };

  // show your audio part
  const handleAudioFUpload = () => {
    const audiostorageRef = sref(storage, audioUrl);
    uploadBytes(audiostorageRef, blob).then((snapshot) => {
      getDownloadURL(audiostorageRef).then((downloadURL) => {
        set(push(ref(db, "singleMassage/")), {
          senderId: users.uid,
          senderName: users.displayName,
          receverId: active.id,
          receverName: active.name,
          myAudio: downloadURL,
          date: `${new Date().getFullYear()} - ${
            new Date().getMonth() + 1
          }- ${new Date().getDate()}, ${new Date().getHours()} : ${new Date().getMinutes()}`,
        }).then(() => {
          setAudioUrl("");
        });
      });
    });
  };
  // video part start
  // emogi part start
  const [openEmogi, setOpenEmoji] = useState(false);
  const handleEmoji = (emoji) => {
    setMass(mass + emoji.emoji);
  };

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

  // scroll
  const scrollUp = useRef(null);
  useEffect(() => {
    scrollUp.current?.scrollIntoView({ behavior: "smooth" });
  }, [massList]);

  return (
    <>
      <section>
        <div className="chat_box">
          {massFrd.length == 0 ? (
            <Alert severity="info">Add Friends List !</Alert>
          ) : (
            <>
              <div className="chat_friend_list">
                <div className="chat_img">
                  <picture>
                    <img
                      src={active.profile || "./images/user.png"}
                      onError={(e) => {
                        e.target.src = "./images/user.png";
                      }}
                      alt="friend-1"
                    />
                  </picture>
                </div>
                <div className="chat_text">
                  <h1>{active.name} </h1>
                  <p>Online</p>
                </div>
                <div className="chat_icon">
                  <BiDotsVerticalRounded />
                </div>
              </div>

              <div className="chatMassage">
                {active.status == "Single" ? (
                  massList.map((item, i) => (
                    <div ref={scrollUp} key={i}>
                      {item.senderId == users.uid ? (
                        item.myMass ? (
                          <div className="massage_right" key={i}>
                            <div className="chat_massage_right">
                              <p>{item.myMass}</p>
                            </div>
                            <span>
                              {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                            </span>
                          </div>
                        ) : item.myImg ? (
                          <div className="massage_right" key={i}>
                            <div className="chat_img_right">
                              <picture>
                                <ModalImage
                                  small={item.myImg}
                                  medium={item.myImg}
                                  large={item.myImg}
                                  alt=""
                                />
                              </picture>
                            </div>
                            <span>
                              {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                            </span>
                          </div>
                        ) : item.myCamImg ? (
                          <div className="massage_right" key={i}>
                            <div className="chat_img_right">
                              <picture>
                                <ModalImage
                                  small={item.myCamImg}
                                  medium={item.myCamImg}
                                  large={item.myCamImg}
                                  alt=""
                                />
                              </picture>
                            </div>
                            <span>
                              {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                            </span>
                          </div>
                        ) : item.myAudio ? (
                          <div className="massage_right" key={i}>
                            <div className="chat_img_right">
                              <audio controls src={item.myAudio}></audio>
                            </div>
                            <span>
                              {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                            </span>
                          </div>
                        ) : (
                          <div className="massage_right" key={i}>
                            <div className="chat_img_right">
                              <video controls></video>
                            </div>
                            <span>Today, 2:01pm</span>
                          </div>
                        )
                      ) : item.myMass ? (
                        <div className="massage_left" key={i}>
                          <div className="chat_massage">
                            <p>{item.myMass}</p>
                          </div>
                          <span>
                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                          </span>
                        </div>
                      ) : item.myImg ? (
                        <div className="massage_left" key={i}>
                          <div className="chat_massage_img">
                            <picture>
                              <ModalImage
                                small={item.myImg}
                                medium={item.myImg}
                                large={item.myImg}
                                alt=""
                              />
                            </picture>
                          </div>
                          <span>
                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                          </span>
                        </div>
                      ) : item.myCamImg ? (
                        <div className="massage_left" key={i}>
                          <div className="chat_massage_img">
                            <picture>
                              <ModalImage
                                small={item.myCamImg}
                                medium={item.myCamImg}
                                large={item.myCamImg}
                                alt=""
                              />
                            </picture>
                          </div>
                          <span>
                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                          </span>
                        </div>
                      ) : item.myAudio ? (
                        <div className="massage_left" key={i}>
                          <div className="chat_massage_img">
                            <audio controls src={item.myAudio}></audio>
                          </div>
                          <span>
                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                          </span>
                        </div>
                      ) : (
                        <div className="massage_left" key={i}>
                          <div className="chat_massage_img">
                            <video controls></video>
                          </div>
                          <span>Today, 2:01pm</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : users.uid == active.adminId ||
                  grpMassMemList.includes(active.id + users.uid) ? (
                  grpMassList.map((item, i) => (
                    <div ref={scrollUp} key={i}>
                      {item.senderId == users.uid
                        ? item.receverId == active.id && (
                            <div className="massage_right" key={i}>
                              <div className="chat_massage_right">
                                <p>{item.myMass}</p>
                              </div>
                              <span>
                                {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                              </span>
                            </div>
                          )
                        : item.receverId == active.id && (
                            <div className="massage_left" key={i}>
                              <div className="chat_massage">
                                <p>{item.myMass}</p>
                              </div>
                              <span>
                                {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                              </span>
                            </div>
                          )}
                    </div>
                  ))
                ) : (
                  <Alert severity="info">Please Join this Group !</Alert>
                )}
              </div>
              {active.status == "Single" ? (
                <div className="chat_inbox">
                  {blobOpen && !audioUrl && (
                    <>
                      <div className="chat_input">
                        <input
                          type="text"
                          onKeyUp={handleEnter}
                          onChange={(e) => setMass(e.target.value)}
                          value={mass}
                        />
                        <div className="options">
                          <div
                            className="option_svg"
                            onClick={() => setOpen(!open)}
                          >
                            <HiPlus />
                          </div>

                          {open && (
                            <div
                              className="option_content"
                              onClick={() => setOpen(false)}
                            >
                              <div
                                className="camera_option"
                                onClick={() => setOpenCam(true)}
                              >
                                <AiFillCamera />
                              </div>
                              {/* gallary part start */}
                              <div className="gallery_option">
                                <div onClick={() => choseFile.current.click()}>
                                  <GrGallery />
                                </div>
                              </div>
                              {/* gallary part end */}
                              <div
                                className="emoji_option"
                                onClick={() => setOpenEmoji(!openEmogi)}
                              >
                                <BsEmojiSmileUpsideDown />
                              </div>
                            </div>
                          )}
                        </div>
                        {openEmogi && (
                          <div className="emoji">
                            <EmojiPicker onEmojiClick={handleEmoji} />
                          </div>
                        )}
                      </div>
                      {mass && (
                        <div className="chat_submit">
                          <button type="button" onClick={handleMassSend}>
                            <RiSendPlaneFill />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {blobOpen && audioUrl && (
                    <div className="audioButton">
                      <div className="audio_show">
                        <audio controls src={audioUrl}></audio>
                      </div>
                      <div className="audio_send">
                        <button onClick={handleAudioFUpload}>send</button>
                        <button onClick={() => setAudioUrl("")}>Delete</button>
                      </div>
                    </div>
                  )}
                  {!open && (
                    <div
                      className="voice_items"
                      onClick={() => setBlobOpen(!blobOpen)}
                    >
                      <AudioRecorder
                        onRecordingComplete={(blob) => addAudioElement(blob)}

                        // audioTrackConstraints={{
                        //   noiseSuppression: true,
                        //   echoCancellation: true,
                        // }}
                        // downloadOnSavePress={false}
                        // downloadFileExtension="mp3"
                      />
                    </div>
                  )}
                </div>
              ) : users.uid == active.adminId ||
                grpMassMemList.includes(active.id + users.uid) ? (
                <div className="chat_inbox">
                  {blobOpen && !audioUrl && (
                    <>
                      <div className="chat_input">
                        <input
                          type="text"
                          onKeyUp={handleEnter}
                          onChange={(e) => setMass(e.target.value)}
                          value={mass}
                        />
                        <div className="options">
                          <div
                            className="option_svg"
                            onClick={() => setOpen(!open)}
                          >
                            <HiPlus />
                          </div>

                          {open && (
                            <div
                              className="option_content"
                              onClick={() => setOpen(false)}
                            >
                              <div
                                className="camera_option"
                                onClick={() => setOpenCam(true)}
                              >
                                <AiFillCamera />
                              </div>
                              {/* gallary part start */}
                              <div className="gallery_option">
                                <div onClick={() => choseFile.current.click()}>
                                  <GrGallery />
                                </div>
                              </div>
                              {/* gallary part end */}
                              <div
                                className="emoji_option"
                                onClick={() => setOpenEmoji(!openEmogi)}
                              >
                                <BsEmojiSmileUpsideDown />
                              </div>
                            </div>
                          )}
                        </div>
                        {openEmogi && (
                          <div className="emoji">
                            <EmojiPicker onEmojiClick={handleEmoji} />
                          </div>
                        )}
                      </div>
                      {mass && (
                        <div className="chat_submit">
                          <button type="button" onClick={handleMassSend}>
                            <RiSendPlaneFill />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {blobOpen && audioUrl && (
                    <div className="audioButton">
                      <div className="audio_show">
                        <audio controls src={audioUrl}></audio>
                      </div>
                      <div className="audio_send">
                        <button onClick={handleAudioFUpload}>send</button>
                        <button onClick={() => setAudioUrl("")}>Delete</button>
                      </div>
                    </div>
                  )}
                  {!open && (
                    <div
                      className="voice_items"
                      onClick={() => setBlobOpen(!blobOpen)}
                    >
                      <AudioRecorder
                        onRecordingComplete={(blob) => addAudioElement(blob)}

                        // audioTrackConstraints={{
                        //   noiseSuppression: true,
                        //   echoCancellation: true,
                        // }}
                        // downloadOnSavePress={false}
                        // downloadFileExtension="mp3"
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>
        {openCam && (
          <div className="open_camera">
            <Camera
              onTakePhoto={(dataUri) => {
                handleTakePhoto(dataUri);
              }}
              isFullscreen={false}
            />
            <div className="camer_cros" onClick={() => setOpenCam(!blobOpen)}>
              <GrClose />
            </div>
          </div>
        )}
        <div className="gallary_inpyt">
          <input
            multiple
            hidden
            type="file"
            onChange={handleImageUpload}
            ref={choseFile}
          />
        </div>
      </section>
    </>
  );
};

export default ChattingMassage;
