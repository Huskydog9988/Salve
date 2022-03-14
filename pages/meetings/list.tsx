import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import MeetingsTable from "../../src/MeetingsTable";
import { MeetingData } from "../../src/MeetingData";
import ButtonLink from "../../src/ButtonLink";
import { socket } from "../../src/socket";
import dynamic from "next/dynamic";

const MeetingsTable = dynamic(() => import("../../src/MeetingsTable"));

const Home: NextPage = () => {
  // const meetings: MeetingData[] = [];

  const [meetings, setMeetings] = useState<MeetingData[]>([]);

  useEffect(() => {
    socket.on("meeting:list:result", (result) => {
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
        <MeetingsTable meetings={meetings} />
      </Box>
    </Container>
  );
};

export default Home;
