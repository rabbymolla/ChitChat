import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { getDatabase, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { GroupCreate } from "../../Validation/Yup";

const GroupModal = ({ open, setOpen }) => {
  const users = useSelector((user) => user.counter.value);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const handleClose = () => setOpen(false);
  // from validation part start

  const db = getDatabase();
  const formik = useFormik({
    initialValues: {
      groupName: "",
      groupTitle: "",
    },
    validationSchema: GroupCreate,
    onSubmit: () => {
      set(push(ref(db, "Groups/")), {
        groupname: formik.values.groupName,
        groupTitle: formik.values.groupTitle,
        adminName: users.displayName,
        adminId: users.uid,
      }).then(() => {
        formik.resetForm();
        setOpen(false);
      });
    },
  });

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create a New Group
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <div className="input_field">
              <TextField
                fullWidth
                id="outlined-basic"
                label="Name"
                variant="outlined"
                value={formik.values.groupName}
                name="groupName"
                onChange={formik.handleChange}
              />
              {formik.errors.groupName ? (
                <p className="error">{formik.errors.groupName}</p>
              ) : null}
            </div>
            <div className="input_field">
              <TextField
                className="group_fild"
                fullWidth
                id="outlined-basic"
                label="Group Title"
                variant="outlined"
                name="groupTitle"
                onChange={formik.handleChange}
                value={formik.values.groupTitle}
              />
              {formik.touched.groupTitle && formik.errors.groupTitle ? (
                <p className="errortwo">{formik.errors.groupTitle}</p>
              ) : null}
            </div>
            <Button variant="contained" type="submit">
              Create Group
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default GroupModal;
