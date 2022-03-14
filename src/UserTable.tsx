import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import { socket } from "./socket";

// Meeting Info passed to table
export interface UserInfo {
  name: string;
  id: string;
}

interface HomeTableProps {
  users: UserInfo[];
}
function deleteUser(
  event: React.MouseEvent<HTMLButtonElement>,
  user: UserInfo
) {
  event.preventDefault();
  console.log(`Deleted ${user.id}`);
  socket.emit("user:delete", user);
}

export default function HomeTable({ users }: HomeTableProps) {
  return (
    <TableContainer style={{ maxHeight: "3", overflow: "auto", height: 320 }}>
      <Table
        sx={{ minWidth: 300, maxHeight: 400 }}
        aria-label="simple table"
        stickyHeader
      >
        {/* Head Labels for columns */}
        <TableHead>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left"></TableCell>
            {/*<TableCell align="right">On Time</TableCell>*/}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* loop through rows and make a row from it */}
          {users.map((user) => {
            return (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell align="left">{user.id}</TableCell>
                <TableCell align="left">
                  <Button
                    variant="contained"
                    onClick={(e) => deleteUser(e, user)}
                  >
                    Delete User
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
