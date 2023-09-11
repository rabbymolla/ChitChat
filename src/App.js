import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Forget from "./Pages/Forget";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Message from "./Pages/Massage";
import Notification from "./Pages/Notification";
import Ragistration from "./Pages/Ragistration";
import Settings from "./Pages/Setting";
import Loggend from "./ProvietRouter/Loggend";
import NotLoggend from "./ProvietRouter/NotLoggend";
import RootLayout from "./RootLayout";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<Loggend />}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/message" element={<Message />}></Route>
            <Route path="/notification" element={<Notification />}></Route>
            <Route path="/setting" element={<Settings />}></Route>
          </Route>
        </Route>
        <Route element={<NotLoggend />}>
          <Route path="/ragistration" element={<Ragistration />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forget" element={<Forget />}></Route>
        </Route>
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
