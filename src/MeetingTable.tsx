import { DateTime } from "luxon";
import { ParticipantAndStudent } from "./shared/meetingAndParticipants";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { GridValueGetterParams } from "@mui/x-data-grid/models/params";
import { GridColDef } from "@mui/x-data-grid/models";
import { exportOptions } from "./shared/exportOptions";

interface MeetingTableProps {
  users: ParticipantAndStudent[];
  lateTime: DateTime | undefined;
  meetingName: string;
}
/**
 * Sorting algorithm for users
 */
export default function MeetingTable({
  users,
  lateTime,
  meetingName,
}: MeetingTableProps) {
  const { csvOptions, printOptions } = exportOptions(meetingName);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      type: "number",
      width: 100,
      valueGetter: (params: GridValueGetterParams) => {
        return params.row.student.id;
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 230,
      valueGetter: (params: GridValueGetterParams) => {
        return params.row.student.name;
      },
    },
    {
      field: "joinTime",
      headerName: "Join Time",
      width: 230,
      valueGetter: (params: GridValueGetterParams) =>
        `${DateTime.fromISO(params.row.joinTime).toLocaleString(
          DateTime.TIME_24_WITH_SECONDS
        )}`,
    },
    {
      field: "late",
      headerName: "Late",
      width: 160,
      valueGetter: (params: GridValueGetterParams) => {
        // joinTime is a string, it must be converted to a DateTime
        if (
          lateTime &&
          DateTime.fromISO(params.row.joinTime).toMillis() > lateTime.toMillis()
        ) {
          return "Late";
        } else {
          return "";
        }
      },
    },
  ];

  return (
    <div style={{ height: 350, width: "100%" }}>
      <DataGrid
        sx={{
          "@media print": {
            ".MuiDataGrid-main": { color: "rgba(0, 0, 0, 0.87)" },
          },
        }}
        columns={columns}
        rows={users}
        disableColumnMenu
        columnBuffer={2}
        columnThreshold={2}
        disableColumnSelector
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{ toolbar: { csvOptions, printOptions } }}
      />
    </div>
  );
}
