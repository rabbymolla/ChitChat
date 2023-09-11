import * as Yup from "yup";

export const signUp = Yup.object({
  fullName: Yup.string().min(3).required("Invalid Your Name"),
  email: Yup.string().email().required("Invalid Your Email Address"),
  password: Yup.string().min(6).required("Invalid Your Password"),
  confirmPassword: Yup.string()
    .min(6)
    .oneOf([Yup.ref("password"), null], "Must be Matched Your Password")
    .required("Invalid Your Confirm Password"),
});
export const signIn = Yup.object({
  email: Yup.string().email().required("Invalid Your Email Address"),
  password: Yup.string().min(6).required("Invalid Your Password"),
});
export const ForgetPassword = Yup.object({
  email: Yup.string().email().required("Invalid Your Email Address"),
});
export const GroupCreate = Yup.object({
  groupName: Yup.string().required("Invalid Your Group Name"),
  groupTitle: Yup.string().required("Invalid Your tittle"),
});
export const UpdateName = Yup.object({
  fullName: Yup.string().min(3).required("Invalid Your Name"),
});
