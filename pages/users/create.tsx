import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { socket } from "../../src/socket";

import ButtonLink from "../../src/ButtonLink";
import { UserData } from "../../src/UserData";
import { useState, useEffect } from "react";

export default function Scan() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  const [error_name, setError_name] = useState(false);
  const [error_id, setError_id] = useState(false);
  useEffect(() => {
    socket.on("user:create:result", (id) => {
      setCreatingUser(false);
    });
  }, []);
  function CreateUser(event: React.MouseEvent<HTMLButtonElement>) {
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

  return (
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
        <ButtonLink link="/users/list">View all Users</ButtonLink>
        <ButtonLink link="/">Go to the home page</ButtonLink>
      </Box>
    </Box>
  );
}
