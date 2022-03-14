import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { DateTime, Duration } from "luxon";
import React from "react";
import ButtonLink from "./ButtonLink";
import { MeetingData } from "./MeetingData";
interface HomeTableProps {
  meetings: MeetingData[];
}

export default function MeetingTable({ meetings }: HomeTableProps) {
  const [emEndTime, setEMEndTime] = React.useState(new Date().toISOString());

  // const emEndTime = ;
  // const emEndTimeISO = emEndTime.toISO();

  return (
    <TableContainer style={{ maxHeight: "3", overflow: "auto", height: 360 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
        {/* Head Labels for columns */}
        <TableHead>
          <TableRow>
            <TableCell>Meeting Name</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Meeting Length</TableCell>
            <TableCell align="left">Amount of People</TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* loop through rows and make a row from it */}
          {meetings.map((meeting) => {
            const end = DateTime.fromISO(meeting.endTime || emEndTime);
            const start = DateTime.fromISO(meeting.startTime);
            const diff = end.diff(start);
            // const dur = Duration.fromObject(diff.toObject()).toHuman({ listStyle: "long" });

            // converts different in times between start and end to "hh:mm:ss" format
            const dur = Duration.fromObject(diff.toObject()).toFormat(
              "hh:mm:ss"
            );

            const link = `/meetings/info/${meeting.id}`;

            return (
              <TableRow
                key={meeting.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {meeting.name}
                </TableCell>
                <TableCell align="left">
                  {DateTime.fromISO(meeting.startTime).toLocaleString(
                    DateTime.DATETIME_SHORT
                  )}
                </TableCell>
                <TableCell align="left">{dur}</TableCell>
                <TableCell align="left">
                  {meeting.participants.length}
                </TableCell>
                <TableCell align="left">
                  {/* <Button variant="contained">
                    <Link href={link} underline="none">
                      More Info
                    </Link>
                  </Button> */}
                  <ButtonLink link={link}>More Info</ButtonLink>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
