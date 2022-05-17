import { DateTime } from "luxon";
import { ParticipantAndStudent } from "./shared/meetingAndParticipants";
import {
  DataGrid,
  GridToolbar,
  GridCsvExportOptions,
  GridPrintExportOptions,
} from "@mui/x-data-grid";
import { GridValueGetterParams } from "@mui/x-data-grid/models/params";
import { GridColDef } from "@mui/x-data-grid/models";

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
      if (params.row.late) {
        return "Late";
      } else {
        return "";
      }
    },
  },
];

interface MeetingTableProps {
  users: ParticipantAndStudent[];
  lateTime: DateTime | undefined;
  meetingName: string;
}
/**
 * Sorting algorithm for users
 */
export default function MeetingsTable({
  users,
  lateTime,
  meetingName,
}: MeetingTableProps) {
  const fileName = `${meetingName} - Salve`;

  const csvOptions: GridCsvExportOptions = {
    fileName,
    utf8WithBom: true,
  };

  const printOptions: GridPrintExportOptions = {
    hideToolbar: true,
    fileName,
  };

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
