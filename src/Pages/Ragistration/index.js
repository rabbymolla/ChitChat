import { Grid, InputAdornment } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import "./style.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { useFormik } from "formik";
import { signUp } from "../../Validation/Yup";
import { ToastContainer, toast } from "react-toastify";
import DotLoader from "react-spinners/DotLoader";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { getDatabase, push, ref, set } from "firebase/database";

const Ragistration = () => {
  // input Eye area part
  const [eye, setEye] = useState("password");
  const handleEye = () => {
    if (eye == "password") {
      setEye("text");
    } else {
      setEye("password");
    }
  };
  const [eyeTwo, setEyeTwo] = useState("password");
  const handleEyeTwo = () => {
    if (eyeTwo == "password") {
      setEyeTwo("text");
    } else {
      setEyeTwo("password");
    }
  };

  // input Eye area part end
  // input validation area part
  const [loding, setLoding] = useState(false);
  const auth = getAuth();
  const db = getDatabase();
  const naviget = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signUp,
    onSubmit: () => {
      setLoding(true);
      createUserWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then(({ user }) => {
          formik.resetForm();
          setLoding(false);
          // console.log(user);
          updateProfile(auth.currentUser, {
            displayName: formik.values.fullName,
          }).then(() => {
            sendEmailVerification(auth.currentUser)
              .then(() => {
                set(ref(db, "users/" + user.uid), {
                  username: user.displayName,
                  email: user.email,
                });
                toast.success("Please Chack Your Email", {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                });
              })
              .then(() => {
                setTimeout(() => {
                  naviget("/login");
                }, 4300);
              });
          });
        })
        .catch((error) => {
          if (error.code.includes("auth/email-already-in-use")) {
            toast.error("Email Already in Use", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
          setLoding(false);
        });
    },
  });

  // input validation area part end

  return (
    <>
      <section>
        <Container fixed>
          <Grid container spacing={2} className="main">
            <Grid item lg={6}>
              <div className="input_hadding">
                <h1>Get started with easily register</h1>
                <p>Free register and you can enjoy it</p>
              </div>
              <div className="input_items">
                <form onSubmit={formik.handleSubmit}>
                  <div className="input_field">
                    <TextField
                      className="input_textField"
                      label="Full Name"
                      variant="outlined"
                      type="text"
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.fullName ? (
                      <p className="error">{formik.errors.fullName}</p>
                    ) : null}
                  </div>
                  <div className="input_field gap">
                    <TextField
                      className="input_textField"
                      label="Email"
                      variant="outlined"
                      type="email"
                      value={formik.values.email}
                      name="email"
                      onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <p className="error">{formik.errors.email}</p>
                    ) : null}
                  </div>
                  <div className="input_field gap">
                    <TextField
                      className="input_textField"
                      label="Password"
                      variant="outlined"
                      name="password"
                      type={eye}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" onClick={handleEye}>
                            {eye == "password" ? (
                              <AiFillEyeInvisible className="input_eye" />
                            ) : (
                              <AiFillEye className="input_eye" />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <p className="error">{formik.errors.password}</p>
                    ) : null}
                  </div>
                  <div className="input_field gap">
                    <TextField
                      className="input_textField"
                      label="Confirm Password"
                      variant="outlined"
                      name="confirmPassword"
                      type={eyeTwo}
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" onClick={handleEyeTwo}>
                            {eyeTwo == "password" ? (
                              <AiFillEyeInvisible className="input_eye" />
                            ) : (
                              <AiFillEye className="input_eye" />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                      <p className="error">{formik.errors.confirmPassword}</p>
                    ) : null}
                  </div>
                  <div className="input_button">
                    {loding ? (
                      <Button
                        className="signUp"
                        variant="contained"
                        color="success"
                        type="submit"
                      >
                        <DotLoader size={"20px"} color="#fff" />
                      </Button>
                    ) : (
                      <Button
                        className="signUp"
                        variant="contained"
                        color="success"
                        type="submit"
                      >
                        Sign up
                      </Button>
                    )}
                  </div>
                </form>
                <div className="input_end">
                  <span>alraedy have an account ? </span>
                  <NavLink to="/login" className="input_link">
                    Sign in
                  </NavLink>
                </div>
              </div>
            </Grid>
            <Grid item lg={6}>
              <div className="input_img">
                <picture>
                  <img src="./images/signUp.png" alt="sign_up" />
                </picture>
              </div>
            </Grid>
          </Grid>
          <ToastContainer />
        </Container>
      </section>
    </>
  );
};

export default Ragistration;
