import React from "react";
import Cropper from "react-cropper";
import { IoMdArrowBack } from "react-icons/io";
import Button from "@mui/material/Button";
import "cropperjs/dist/cropper.css";
import { ClipLoader } from "react-spinners";

const ImgCroper = ({
  image,
  setCropper,
  setImage,
  cropData,
  getCropData,
  loding,
  setLoding,
}) => {
  return (
    <>
      {/* this is test */}
      <div className="croper_box">
        <div className="croper_title">
          <div className="croper_icon" onClick={() => setImage()}>
            <IoMdArrowBack />
          </div>
          <div className="croper_text">
            <h1>Upload Your Profile Pitcure</h1>
          </div>
        </div>
        <div className="corop_preview">
          <div className="img-preview"></div>
        </div>
        <div className="crop_img">
          <Cropper
            style={{ height: 400, width: "100%" }}
            zoomTo={0.5}
            initialAspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            onInitialized={(instance) => {
              setCropper(instance);
            }}
            guides={true}
          />
        </div>
        <div className="upload_bitton" onClick={getCropData}>
          {loding ? (
            <Button variant="contained" color="success">
              <ClipLoader color="#fff" />
            </Button>
          ) : (
            <Button variant="contained" color="success">
              Upload Now
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ImgCroper;
