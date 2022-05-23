import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { socket } from "./socket";
import { Student } from "@prisma/client";
import { GridCellParams, GridColDef, MuiEvent } from "@mui/x-data-grid/models";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { exportOptions } from "./shared/exportOptions";

import { useState } from "react";
import { EditUserName } from "./shared/editUser";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    type: "number",
    width: 100,
    editable: false,
  },
  {
    field: "name",
    headerName: "Name",
    width: 250,
    editable: true,
  },
  {
    field: "delete",
    headerName: "Delete",
    width: 80,
    hideSortIcons: true,
  },
];

const { csvOptions, printOptions } = exportOptions("User List");

interface HomeTableProps {
  users: Student[];
}

export default function HomeTable({ users }: HomeTableProps) {
  const [alert, setAlert] = useState(Boolean);
  const [deletingID, setDeletingID] = useState();

  function deleteUser(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    console.log(`Deleted ${deletingID}`);
    socket.emit("user:delete", deletingID);
  }
  function sendAlert(event: React.MouseEvent<HTMLButtonElement>) {
    setAlert(true);
  }
  function cancelDelete(event: React.MouseEvent<HTMLButtonElement>) {
    setAlert(false);
  }
  return (
    <div style={{ height: 400, width: "100%" }}>
      <>
        {/*Creates pop-up when meeting is deleted to confirm deletion*/}
        {alert && (
          <Dialog
            open={alert}
            onClose={cancelDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete This User?"}
            </DialogTitle>
            <DialogActions>
              {/*Closes pop-up if denied*/}
              <Button onClick={cancelDelete}>No</Button>
              {/*Runs delete function if confirmed*/}

              <Button onClick={deleteUser} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </>
      <DataGrid
        columns={columns}
        rows={users}
        disableColumnMenu
        columnBuffer={2}
        columnThreshold={2}
        disableColumnSelector
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
        onCellClick={(
          params: GridCellParams,
          event: MuiEvent<React.MouseEvent>
        ) => {
          if (params.colDef.headerName == "Delete") {
            event.defaultMuiPrevented = true;
            setAlert(true);
            setDeletingID(params.row.id);
          }
        }}
        onCellEditCommit={(params) => {
          console.log({ params });

          const data: EditUserName = { id: params.id + "", name: params.value };

          console.log(`Edit ${data}`);
          socket.emit("user:edit", data);
        }}
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{ toolbar: { csvOptions, printOptions } }}
      />
    </div>
  );
}
