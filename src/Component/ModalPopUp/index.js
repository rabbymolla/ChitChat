import React from "react";

import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";

import Sheet from "@mui/joy/Sheet";
import UploadFile from "../UplodeFile";

const ModalProfile = ({ open, setOpen }) => {
  return (
    <>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          sx={{
            borderRadius: "md",
            p: 3,
            boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
          }}
        >
          <ModalClose
            sx={{
              top: "calc(-0/25 * var(--IconButton-size))",
              right: "calc(-0/25 * var(--IconButton-size))",
              boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
              borderRadius: "50%",
              bgcolor: "#fff",
            }}
          />
          <UploadFile setOpen={setOpen} />
        </Sheet>
      </Modal>
    </>
  );
};

export default ModalProfile;
