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
import { UserData } from "../../src/UserData";
import { useEffect, useState, MouseEvent } from "react";

const Home: NextPage = () => {
  const router = useRouter();

  const [users, setUsers] = useState<UserData[]>([]);

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  const [error_name, setError_name] = useState(false);
  const [error_id, setError_id] = useState(false);

  function CreateUser(event: MouseEvent<HTMLButtonElement>) {
    // prevent page reload

    event.preventDefault();

    if (name.length < 1) {
      setError_name(true);
    }
    if (id.length < 1) {
      setError_id(true);
    }

    if (id.length >= 1 && name.length >= 1) {
      // handleClickOpen();
      const user: UserData = {
        id,
        name,
      };

      socket.emit("user:create", user);
      setCreatingUser(true);
      setName("");
      setId("");
    }

    //add feathers here
  }

  useEffect(() => {
    socket.on("user:create:result", (id) => {
      setCreatingUser(false);
      router.reload();
    });
  }, [router]);
  useEffect(() => {
    socket.on("user:list:result", (result) => {
      setUsers(result);
    });
  }, []);
  useEffect(() => {
    socket.on("user:delete:result", (id) => {
      // users.splice(users.findIndex((user) => user.id === id), 1)
      // setUsers(users);
      router.reload();
    });
  }, [router]);

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
                <UserTable users={users} />
              </Box>
            </Container>
          </Grid>
          <Grid item xs={5}>
            <Box>
              {/* <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Use Google's location service?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {JSON.stringify(time)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog> */}
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
                  helperText="The name of the user"
                  variant="outlined"
                  value={name}
                  onChange={(event) => {
                    setError_name(false);
                    setName(event.target.value);
                  }}
                />

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

                <LoadingButton
                  variant="contained"
                  onClick={CreateUser}
                  type="submit"
                  loading={creatingUser}
                >
                  Create User
                </LoadingButton>
                {/* <Button variant="contained" onClick={CreateUser} type="submit">
      Create User
    </Button> */}
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
