import { Grid } from "@mui/material";
import React from "react";
import Sidebar from "../Component/SIdeBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <section>
        <Grid container>
          <Grid item lg={1}>
            <Sidebar />
          </Grid>
          <Grid item lg={11}>
            <Outlet />
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default RootLayout;
