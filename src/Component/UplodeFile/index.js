import React, { useRef, useState } from "react";
import "./style.css";
import { MdPhotoLibrary } from "react-icons/md";
import ImgCroper from "./imgCroper";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginUsers } from "../../Features/Slice/LoginSlice";

const UploadFile = ({ setOpen }) => {
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const storage = getStorage();
  const users = useSelector((user) => user.counter.value);

  const storageRef = ref(storage, users.uid);
  const auth = getAuth();
  const dispatch = useDispatch();
  const handleClick = useRef(null);
  const [loding, setLoding] = useState(false);
  // upload your photo
  const handleProfile = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    setLoding(true);
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            setOpen(false);
            dispatch(loginUsers({ ...users, photoURL: downloadURL }));
            localStorage.setItem(
              "users",
              JSON.stringify({ ...users, photoURL: downloadURL })
            );
            setLoding(false);
          });
        });
      });
    }
  };
  // upload your photo end
  return (
    <>
      <section>
        <div className="upload_box">
          <div
            className="upload_items"
            onClick={() => handleClick.current.click()}
          >
            <MdPhotoLibrary />
            <input
              type="file"
              hidden
              ref={handleClick}
              onChange={handleProfile}
            />
          </div>
          <div className="upload_content">
            <p>Upload Your Photo</p>
          </div>
        </div>
        <div className="upload_prps">
          {image && (
            <>
              {
                <ImgCroper
                  image={image}
                  setImage={setImage}
                  setCropper={setCropper}
                  cropData={cropData}
                  getCropData={getCropData}
                  setLoding={setLoding}
                  loding={loding}
                />
              }
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default UploadFile;
