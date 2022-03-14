import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { DateTime, Duration } from "luxon";
import Alert from "@mui/material/Alert";
import { UserMeetingDataPlus } from "./MeetingData";

interface MeetingTableProps {
  users: UserMeetingDataPlus[];
  lateTime: DateTime | undefined;
}
/**
 * Sorting algorithm for users
 */
export default function MeetingsTable({ users, lateTime }: MeetingTableProps) {
  users.sort((a, b) => {
    if (a < b) {
      return -1;
    } else if (a == b) {
      return 0;
    } else {
      return 1;
    }
  });

  return (
    <TableContainer style={{ maxHeight: "3", overflow: "auto", height: 320 }}>
      <Table
        sx={{ minWidth: 500, maxWidth: 600 }}
        aria-label="simple table"
        stickyHeader
      >
        {/* Head Labels for columns */}
        <TableHead>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Time Joined</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* loop through rows and make a row from it */}
          {users.map((user) => {
            const joinTime = DateTime.fromISO(user.joinTime);

            const dur = joinTime.toFormat("hh:mm:ss");
            const late =
              lateTime !== undefined
                ? joinTime.startOf("minute") > lateTime.startOf("minute")
                : false;

            return (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell align="left">{user.id}</TableCell>
                {(() => {
                  if (late) {
                    // late
                    return (
                      <TableCell align="center">
                        <Alert sx={{ width: "60%" }} severity="error">
                          {dur}
                        </Alert>
                      </TableCell>
                    );
                  } else {
                    // on time
                    return (
                      <TableCell align="center">
                        <Alert sx={{ width: "60%" }} severity="success">
                          {dur}
                        </Alert>
                      </TableCell>
                    );
                  }
                })()}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
