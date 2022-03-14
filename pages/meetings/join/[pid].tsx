import { QuaggaJSResultObject_CodeResult } from "@ericblade/quagga2";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import { socket } from "../../../src/socket";
import Results from "../../../src/join/Results";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { MeetingDataPlus } from "../../../src/MeetingData";
import { useEffect, useState, useRef } from "react";

const Scanner = dynamic(() => import("../../../src/join/Scanner"));

export default function Scan() {
  // whether scanner is running or not
  const [scanning, setScanning] = useState(false);
  // user array
  const [users, setUsers] = useState<Set<string>>(new Set());
  // for entering the IDs manually
  const [enteredID, setEnteredID] = useState("");
  const [error_id, setError_id] = useState(false);
  // scanner
  const scannerRef = useRef<Element | string | undefined>(undefined);

  const router = useRouter();
  const { pid } = router.query;

  //const enteredID = "";

  // socket.emit("meeting:end", pid);

  // console.log(`pid glob ${pid}`);

  function pushUsers(id: string) {
    // setUsers((prevUsers) => new Set([...users, id]));
    setUsers((prevUsers) => new Set(prevUsers.add(id)));
  }

  //Display information of added users in meeting
  useEffect(() => {
    socket.on(
      "meeting:getPlus:result",
      (result: (MeetingDataPlus & unknown) | null) => {
        if (result === null) return;

        setUsers(
          new Set(
            result.participants.map((user) => {
              return user.name;
            })
          )
        );
      }
    );
  }, []);

  useEffect(() => {
    socket.on("meeting:user:join:result", (user) => {
      pushUsers(user);
    });
  }, []);

  useEffect(() => {
    socket.emit("join", pid);
    socket.emit("meeting:getPlus", pid);
  }, [pid]);

  function saveUser(id: string) {
    socket.emit("meeting:user:join", {
      meeting: pid,
      user: id,
    });
  }

  function detected(result: string) {
    const char = result[0];
    saveUser(result.substring(+(char === "P")));
  }
  function manualID(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (enteredID.length < 1) {
      setError_id(true);
    }

    if (enteredID.length >= 1) {
      detected(enteredID);
      setEnteredID("");
    }
  }

  function endMeeting(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    socket.emit("meeting:end", pid);
  }

  useEffect(() => {
    socket.on("meeting:end:result", (meetingID) => {
      socket.emit("leave", pid);

      router.push(`/meetings/info/${pid}`);
    });
  }, [pid, router]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={5}>
        <Grid item xs={3} md={6}>
          <Button variant="contained" onClick={() => setScanning(!scanning)}>
            {scanning ? "Stop" : "Start"}
          </Button>
          {/* @ts-ignore */}
          <div ref={scannerRef}>
            <canvas
              className="drawingBuffer"
              style={{
                position: "absolute",
                // top: "50px",
                // left: '0px',
                // height: '100%',
                // width: '100%',
                border: "3px solid #0059B2",
              }}
              width="640"
              height="480"
            />
            {scanning ? (
              <Scanner
                scannerRef={scannerRef}
                onDetected={(code: QuaggaJSResultObject_CodeResult["code"]) =>
                  detected(code || "")
                }
              />
            ) : null}
          </div>
        </Grid>
        <Grid item xs={5}>
          <h1>Users:</h1>
          <Results users={users} />
        </Grid>
      </Grid>

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
      ></Box>
      <Grid container spacing={1} direction="row">
        <Grid item xs={3}></Grid>
        <Grid item xs={3}>
          <TextField
            required
            id="id"
            label="ID"
            helperText="Users ID"
            variant="outlined"
            error={error_id}
            value={enteredID}
            onChange={(event) => {
              setError_id(false);
              setEnteredID(event.target.value);
            }}
          />
          <Button variant="contained" onClick={manualID} type="submit">
            Add User
          </Button>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Button variant="contained" onClick={endMeeting}>
            End Meeting
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}