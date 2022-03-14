import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ButtonLink from "../src/ButtonLink";

const About: NextPage = () => {
  //Nothing suspicious, that's for sure

  // const links = [
  //   "https://archive.org/details/TheLastBomb1945",
  //   //"https://www.youtube.com/watch?v=jEexefuB62c",
  //   //"https://www.youtube.com/watch?v=NS4-2zvifSk",
  //   //"https://external-preview.redd.it/pfgiVAhWSTpj0IEijor0f_x6E-XEhlWT8C5O-tvuF_Y.png?auto=webp&s=02f7d2ca528930eb4d69d02f108937e033a3a356",
  // ];
  // const index = Math.floor(Math.random() * (links.length - 0 + 1)) + 0;
  // const videoLink = links[index];

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
        {/* Description */}
        <Typography variant="h1" component="h1" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Salve is a website that allows teachers and students to start classes
          more easily. Teachers can create a meeting on the website which tracks
          the arrival of students into their class. Students will go up to the
          computer and scan their IDs by holding up to the camera, and the
          system will log their name, time they enter into the meeting, and
          whether or not they were late based on that. The inspiration behind
          this project is seeing many minutes of class time wasted on role calls
          and determining who is absent or late. The world is shifting to online
          technology, so why are we still waiting for students to respond
          &quot;here&quot;?
        </Typography>
        {/* Return to home page */}
        <ButtonLink link="/">Go to the home page</ButtonLink>
      </Box>
    </Container>
  );
};

export default About;
