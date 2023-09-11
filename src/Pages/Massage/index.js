import React from "react";
import "./style.css";
import { Grid } from "@mui/material";
import MassageGroup from "../../Component/MassageGroup";
import MassageFriends from "../../Component/MassageFriends";
import ChattingMassage from "../../Component/ChattingMassage";

const Message = () => {
  return (
    <>
      <section id="massagee">
        <Grid container>
          <Grid className="spacing_left" item lg={5}>
            <div className="massage_items">
              <MassageGroup />
            </div>
            <div className="massage_content">
              <MassageFriends />
            </div>
          </Grid>
          <Grid className="spacing_left" item lg={7}>
            <ChattingMassage />
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default Message;
