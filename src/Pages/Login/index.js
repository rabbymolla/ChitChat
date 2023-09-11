import { Grid, InputAdornment } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Container } from "@mui/system";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useFormik } from "formik";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { DotLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import { loginUsers } from "../../Features/Slice/LoginSlice";
import { signIn } from "../../Validation/Yup";
import "./style.css";

const Login = () => {
  // login eye part area
  const [loginEye, setLoginEye] = useState("password");
  const handleLoginEye = () => {
    if (loginEye == "password") {
      setLoginEye("text");
    } else {
      setLoginEye("password");
    }
  };
  // login eye part area end
  // login validation part start
  const [loding, setLoding] = useState(false);
  const naviget = useNavigate();
  const auth = getAuth();
  const dispatch = useDispatch();
  const db = getDatabase();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signIn,
    onSubmit: () => {
      setLoding(true);
      signInWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then(({ user }) => {
          if (auth.currentUser.emailVerified == true) {
            setLoding(false);
            formik.resetForm();
            naviget("/");
            dispatch(loginUsers(user));
            localStorage.setItem("users", JSON.stringify(user));
            set(ref(db, "Online/" + user.uid), {
              onlineName: user.displayName,
            });
          } else {
            setLoding(false);
            toast.error("Eamil Verified Needed", {
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
        })
        .catch((error) => {
          if (error.code.includes("auth/user-not-found")) {
            toast.error("Wrong Eamil Addrese", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else if (error.code.includes("auth/wrong-password")) {
            toast.error("Wrong Password", {
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
  // login validation part  area end

  // google auth with popup part start
  const googleProvider = new GoogleAuthProvider();

  const handleGooglePopup = () => {
    signInWithPopup(auth, googleProvider).then(({ user }) => {
      naviget("/");
      set(ref(db, "users/" + user.uid), {
        username: user.displayName,
        email: user.email,
      }).then(() => {
        dispatch(loginUsers(user));
        localStorage.setItem("users", JSON.stringify(user));
      });
    });
  };
  // google auth with popup part end
  // facebook auth with popup part start

  const handleFacebookPopup = () => {
    const facebookProvider = new FacebookAuthProvider();
    signInWithPopup(auth, facebookProvider)
      .then(({ user }) => {
        naviget("/");
        set(ref(db, "users/" + user.uid), {
          username: user.displayName,
          email: user.email,
        }).then(() => {
          dispatch(loginUsers(user));
          localStorage.setItem("users", JSON.stringify(user));
        });
      })
      .catch((error) => {
        if (error.code.includes("auth/user-not-found")) {
          toast.error("You don't have an email on Facebook", {
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
      });
  };
  // facebook auth with popup part end
  return (
    <>
      <section>
        <Container fixed>
          <ToastContainer />
          <Grid container spacing={2} className="main">
            <Grid item lg={6}>
              <div className="input_img">
                <picture>
                  <img src="./images/Login-pana.png" alt="sign_up" />
                </picture>
              </div>
            </Grid>
            <Grid item lg={6}>
              <div className="login_hadding">
                <h1>Login to your account!</h1>
              </div>
              <div className="login_google">
                <NavLink
                  to=""
                  className="google_link"
                  onClick={handleGooglePopup}
                >
                  <picture>
                    <img
                      loading="lazy"
                      src="./images/login_google.png"
                      alt="google"
                    />
                  </picture>
                  <p>Login with Google</p>
                </NavLink>
                <NavLink
                  to=""
                  className="google_link"
                  onClick={handleFacebookPopup}
                >
                  <picture>
                    <img
                      className="facbook_img"
                      loading="lazy"
                      src="./images/Facebook.png"
                      alt="Facebook"
                    />
                  </picture>
                  <p>Login with Facebook</p>
                </NavLink>
              </div>
              <div className="login_items">
                <form onSubmit={formik.handleSubmit}>
                  <div className="input_field">
                    <TextField
                      label="Email Addres"
                      variant="standard"
                      className="login_area"
                      type="eamil"
                      name="email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                    />
                    {formik.errors.email ? (
                      <p className="error">{formik.errors.email}</p>
                    ) : null}
                  </div>
                  <div className="input_field gapping">
                    <TextField
                      label="Password"
                      variant="standard"
                      className="login_area"
                      type={loginEye}
                      name="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={handleLoginEye}
                          >
                            {loginEye == "password" ? (
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
                  <div className="login_button">
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
                        type="submit"
                        variant="contained"
                        color="success"
                        className="login_button_area"
                      >
                        Login to Continue
                      </Button>
                    )}
                  </div>
                </form>
              </div>
              <div className="login_forget">
                <NavLink to="/forget">Forget Password</NavLink>
              </div>
              <div className="login_end">
                <span>Don’t have an account ? </span>
                <NavLink to="/ragistration" className="input_link">
                  Sign up
                </NavLink>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>
    </>
  );
};

export default Login;
