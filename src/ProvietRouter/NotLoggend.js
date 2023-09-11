import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function NotLoggend() {
  const user = useSelector((users) => users.counter.value);
  return user ? <Navigate to="/" /> : <Outlet />;
}
