import { useState, MouseEvent, useEffect } from "react";
import Router from "next/router";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DateAdapter from "@mui/lab/AdapterLuxon";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
// import LoadingButton from "@mui/lab/LoadingButton";
import ButtonLink from "../../src/ButtonLink";
import { socket } from "../../src/socket";
import { DateTime } from "luxon";
import dynamic from "next/dynamic";
import { Grid } from "@mui/material";
import { Meeting } from "@prisma/client";
import { MeetingCreateClient } from "../../src/shared/meetingCreate";

const LoadingButton = dynamic(() => import("@mui/lab/LoadingButton"));

export default function Scan() {
  const [name, setName] = useState("");
  const [time, setTime] = useState<DateTime | null>(null);

  const [creatingMeeting, setCreatingMeeting] = useState(false);

  const [error_name, setError_name] = useState(false);

  useEffect(() => {
    socket.on("meeting:create:result", (meetingId: Meeting["id"]) => {
      // infrom the user we have made the meeting
      setCreatingMeeting(false);

      // redirect the user to meeting page
      Router.push(`/meetings/join/${meetingId}`);
    });
  });

  function CreateMeeting(event: MouseEvent<HTMLButtonElement>) {
    // prevent page reload
    event.preventDefault();

    if (name.length < 1) {
      setError_name(true);
    } else {
      // notify the user we are making the meeting
      setCreatingMeeting(true);

      const meeting: MeetingCreateClient = {
        name,
      };

      // clean date from component
      console.log({ time });
      if (time !== null) meeting.lateTime = time.toISO();

      // send meeting data to db
      socket.emit("meeting:create", meeting);
    }
  }

  return (
    <Box>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },

          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          error={error_name}
          required
          id="name"
          label="Name"
          helperText="The name of the meeting"
          variant="outlined"
          value={name}
          onChange={(event) => {
            setError_name(false);
            setName(event.target.value);
          }}
        />
        <LocalizationProvider dateAdapter={DateAdapter}>
          <TimePicker
            label="Late Time"
            value={time}
            onChange={(newTime) => {
              if (newTime === null) return;
              setTime(newTime);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        {/* Sumbits data, only if it is the correct formatting */}
        <LoadingButton
          variant="contained"
          onClick={CreateMeeting}
          type="submit"
          loading={creatingMeeting}
        >
          Create Meeting
        </LoadingButton>
        {/* Returns to home page */}
        <Grid container>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <ButtonLink link="/">Go to home page</ButtonLink>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
