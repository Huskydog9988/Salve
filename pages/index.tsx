import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Image from "next/image";
import ButtonLink from "../src/ButtonLink";
import Salve from "../docs/Salve.svg";

const Home: NextPage = () => {
  return (
    <Container maxWidth="lg">
      {/* Enable ui to work with different screen sizes */}
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image alt="👋 Salve" src={Salve} width={900} height={300} priority />
        {/* List of links to each page of the website */}
        <ButtonLink link="/meetings/create">Create a Meeting</ButtonLink>
        <ButtonLink link="/meetings/list">View all Meetings</ButtonLink>
        <ButtonLink link="/users/list">View all Users</ButtonLink>
        <ButtonLink link="/about">About Salve</ButtonLink>
      </Box>
    </Container>
  );
};

export default Home;
