import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { UpdateName } from "../../Validation/Yup";
import "./style.css";

const NameModal = ({ open, setOpen }) => {
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

  //   update Name
  const users = useSelector((user) => user.counter.value);
  const formik = useFormik({
    initialValues: {
      fullName: users.displayName,
      email: "",
    },
    validationSchema: UpdateName,
    onSubmit: () => {
      console.log("asi");
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
            <div className="name_hadding">
              <h1> Update Your Name</h1>
            </div>
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <div className="input_field">
              <TextField
                fullWidth
                id="outlined-basic"
                label="Name"
                variant="outlined"
                type="text"
                value={formik.values.fullName}
                name="fullName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.fullName ? (
                <p className="error">{formik.errors.fullName}</p>
              ) : null}
            </div>

            <Button variant="contained" type="submit" className="name_gap">
              Update
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default NameModal;
