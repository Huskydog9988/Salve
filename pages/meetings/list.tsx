import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ButtonLink from "../../src/ButtonLink";
import { socket } from "../../src/socket";
import dynamic from "next/dynamic";
import { MeetingAndParticipants } from "../../src/shared/meetingAndParticipants";

const MeetingsTable = dynamic(() => import("../../src/MeetingsTable"));

const Home: NextPage = () => {
  const [meetings, setMeetings] = useState<MeetingAndParticipants[]>([]);

  // Gets all meetings from the database for display
  useEffect(() => {
    socket.on("meeting:list:result", (result: MeetingAndParticipants[]) => {
      setMeetings(result);
    });
  }, []);

  useEffect(() => {
    socket.emit("meeting:list");
  }, []);

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
        <Typography variant="h1" component="h1" gutterBottom>
          Meetings
        </Typography>
        <ButtonLink link="/">Go to the home page</ButtonLink>
        <ButtonLink link="/meetings/create">Create a meeting</ButtonLink>
        {/* Displays all of the meetings in table */}

        <MeetingsTable meetingData={meetings} />
      </Box>
    </Container>
  );
};

export default Home;
