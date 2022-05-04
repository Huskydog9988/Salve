import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { DateTime } from "luxon";
import MeetingTable from "../../../src/MeetingTable";
import { socket } from "../../../src/socket";
import { useRouter } from "next/router";
import ButtonLink from "../../../src/ButtonLink";
import { useEffect, useState } from "react";
import { Meeting } from "@prisma/client";
import {
  MeetingAndParticipants,
  ParticipantAndStudent,
} from "../../../src/shared/meetingAndParticipants";

const Home: NextPage = () => {
  const router = useRouter();
  // const { pid } = router.query;
  const pid = parseInt(router.query.pid as string);

  //Meeting info
  const [users, setUsers] = useState<ParticipantAndStudent[]>([]);
  const [lateTime, setLateTime] = useState<DateTime | undefined>(undefined);
  const [endTime, setEndTime] = useState<DateTime | undefined>(undefined);
  const [startTime, setStartTime] = useState(DateTime.now());
  const [name, setName] = useState("");

  //If pop-up is shown
  const [alert, setAlert] = useState(Boolean);

  //When meeting is deleted, move user to meeting list
  useEffect(() => {
    socket.on("meeting:delete:result", (meetingID: Meeting["id"]) => {
      router.push(`/meetings/list`);
    });
  }, [router]);

  //When receiving data for the meeting, format and display it on the screen
  useEffect(() => {
    socket.on("meeting:get:result", (result: MeetingAndParticipants | null) => {
      if (result === null) return;

      setUsers(result.participants);

      console.log(result.participants);
      //If a time is specified, display its information
      if (result.lateTime !== null)
        setLateTime(DateTime.fromISO(result.lateTime));
      if (result.endTime !== null) setEndTime(DateTime.fromISO(result.endTime));

      //Set start time and name of meeting
      setStartTime(DateTime.fromISO(result.startTime));
      setName(result.name);
    });
  }, []);

  useEffect(() => {
    socket.emit("meeting:get", pid);
  }, [pid]);

  //Runs when meeting delete is verified
  function deleteMeeting(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    // console.log(`Requested a delete (client) of ${pid}`);
    socket.emit("meeting:delete", pid);
  }

  function sendAlert(event: React.MouseEvent<HTMLButtonElement>) {
    setAlert(true);
  }
  function cancelDelete(event: React.MouseEvent<HTMLButtonElement>) {
    setAlert(false);
  }
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/*Displays information about the meeting*/}

        <Typography variant="h1" component="h1" gutterBottom>
          {name}
        </Typography>

        <Typography variant="h6" component="h6" gutterBottom>
          Start Time: {startTime.toFormat("hh:mm:ss")}
        </Typography>
        <>
          {lateTime !== undefined && (
            <Typography variant="h6" component="h6" gutterBottom>
              Late Time: {lateTime.toFormat("hh:mm:ss")}
            </Typography>
          )}
        </>
        <>
          {endTime !== undefined && (
            <Typography variant="h6" component="h6" gutterBottom>
              End Time: {endTime.toFormat("hh:mm:ss")}
            </Typography>
          )}
        </>
        <Grid container>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            {/*Creates table of users in meeting and times*/}
            <MeetingTable users={users} lateTime={lateTime} />
          </Grid>
        </Grid>
        {/*Creates button to delete meeting*/}
        <Button variant="contained" onClick={sendAlert}>
          Delete Meeting
        </Button>

        <>
          {/*Creates pop-up when meeting is deleted to confirm deletion*/}
          {alert && (
            <Dialog
              open={alert}
              onClose={cancelDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete This Meeting?"}
              </DialogTitle>
              <DialogActions>
                {/*Closes pop-up if denied*/}
                <Button onClick={cancelDelete}>No</Button>
                {/*Runs delete function if confirmed*/}
                <Button onClick={deleteMeeting} autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </>
        <ButtonLink link="/meetings/list">View all Meetings</ButtonLink>
        <ButtonLink link="/">Go to the home page</ButtonLink>
      </Box>
    </Container>
  );
};

export default Home;
