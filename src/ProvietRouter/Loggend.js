import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../Pages/Login";

export default function Loggend() {
  const user = useSelector((users) => users.counter.value);
  return user ? <Outlet /> : <Login />;
}
