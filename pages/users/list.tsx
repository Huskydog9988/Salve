import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UserTable from "../../src/UserTable";
import ButtonLink from "../../src/ButtonLink";
import { socket } from "../../src/socket";
import { Grid, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import { useEffect, useState, MouseEvent } from "react";
import { Student } from "@prisma/client";
import { StudentCreate } from "../../src/shared/studentCreate";

const Home: NextPage = () => {
  const router = useRouter();

  const [users, setUsers] = useState<Student[]>([]);

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  const [error_name, setError_name] = useState(false);
  const [error_id, setError_id] = useState(false);

  function CreateUser(event: MouseEvent<HTMLButtonElement>) {
    // prevent page reload

    event.preventDefault();

    // Only allows user to be added if they name and ID are filled in, else they receive their respective errors
    if (name.length < 1) {
      setError_name(true);
    }
    if (id.length < 1) {
      setError_id(true);
    }

    if (id.length >= 1 && name.length >= 1) {
      const user: StudentCreate = {
        id,
        name,
      };

      socket.emit("user:create", user);
      setCreatingUser(true);
      // Resets fields
      setName("");
      setId("");
    }
  }

  //Reloads page after user added
  useEffect(() => {
    socket.on("user:create:result", (id: Student["id"]) => {
      setCreatingUser(false);
      router.reload();
    });
  }, [router]);
  //Get users when page loaded
  useEffect(() => {
    socket.on("user:list:result", (result: Student[]) => {
      setUsers(result);
    });
  }, []);
  useEffect(() => {
    socket.on("user:delete:result", (id: Student["id"]) => {
      router.reload();
    });
  }, [router]);
  //Asks backend for information on page loaded
  useEffect(() => {
    socket.emit("user:list");
    socket.emit("join", "users");
  }, []);

  return (
    <Container>
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
          User Database
        </Typography>
        <Grid container spacing={0} direction="row">
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
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
                {/* Creates table of users in database */}
                <UserTable users={users} />
              </Box>
            </Container>
          </Grid>
          {/* Form to add users to the database */}
          <Grid item xs={5}>
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
                {/* Name field */}
                <TextField
                  error={error_name}
                  required
                  id="name"
                  label="Name"
                  helperText="The name of the user"
                  variant="outlined"
                  value={name}
                  onChange={(event) => {
                    setError_name(false);
                    setName(event.target.value);
                  }}
                />
                {/* ID field */}
                <TextField
                  error={error_id}
                  required
                  id="id"
                  label="Id"
                  helperText="The ID of the user"
                  variant="outlined"
                  value={id}
                  onChange={(event) => {
                    setError_id(false);
                    setId(event.target.value);
                  }}
                />
                {/* Enter button for creating new users */}
                <LoadingButton
                  variant="contained"
                  onClick={CreateUser}
                  type="submit"
                  loading={creatingUser}
                >
                  Create User
                </LoadingButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <ButtonLink link="/">Go to the home page</ButtonLink>
      </Box>
    </Container>
  );
};

export default Home;
