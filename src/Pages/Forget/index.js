import { Container, Grid } from "@mui/material";
import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./style.css";
import { useFormik } from "formik";
import { ForgetPassword } from "../../Validation/Yup";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

const Forget = () => {
  //use formik part start
  const auth = getAuth();
  const naviget = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgetPassword,
    onSubmit: () => {
      sendPasswordResetEmail(auth, formik.values.email)
        .then(() => {
          toast.success("Check Your Email Account!", {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setTimeout(() => {
            naviget("/login");
          }, 3000);
        })
        .catch((error) => {
          console.log(error.code);
          if (error.code.includes("auth/user-not-found")) {
            toast.error("Worng Your Email !", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
        });
    },
  });
  //use formik part start end
  return (
    <>
      <section>
        <Container fixed>
          <ToastContainer />
          <Grid container spacing={2} className="main">
            <Grid item lg={6}>
              <div className="login_hadding">
                <h1>Reset Your Password!</h1>
              </div>
              <div className="forget_items">
                <form onSubmit={formik.handleSubmit}>
                  <div className="input_field">
                    <TextField
                      fullWidth
                      label="Email"
                      variant="filled"
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.email ? (
                      <p className="error">{formik.errors.email}</p>
                    ) : null}
                  </div>
                  <div className="forget_button">
                    <Button
                      variant="contained"
                      color="success"
                      className="login_button_area"
                      type="submit"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </div>
              <div className="login_end">
                <span>Don’t have an account ? </span>
                <NavLink to="/ragistration" className="input_link">
                  Sign up
                </NavLink>
              </div>
            </Grid>
            <Grid item lg={6}>
              <div className="input_img">
                <picture>
                  <img src="./images/Forgot password-pana.png" alt="sign_up" />
                </picture>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>
    </>
  );
};

export default Forget;
