import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { MeetingAndParticipants } from "./shared/meetingAndParticipants";
import { DateTime } from "luxon";
import ButtonLink from "../src/ButtonLink";
import { exportOptions } from "./shared/exportOptions";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", type: "number", width: 50 },
  {
    field: "name",
    headerName: "Name",
    width: 230,
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,

    valueGetter: (params: GridValueGetterParams<MeetingAndParticipants>) => {
      return params.row.startTime;
    },
    renderCell: (params: GridRenderCellParams) => {
      return DateTime.fromISO(params.row.startTime).toLocaleString(
        DateTime.DATE_MED
      );
    },
  },
  {
    field: "startTime",
    headerName: "Start Time",
    width: 150,
    valueGetter: (params: GridValueGetterParams) =>
      `${DateTime.fromISO(params.row.startTime).toLocaleString(
        DateTime.TIME_24_WITH_SECONDS
      )}`,
  },
  {
    field: "endTime",
    headerName: "End Time",
    width: 150,

    valueGetter: (params: GridValueGetterParams) => {
      if (params.row.endTime !== null) {
        return `${DateTime.fromISO(params.row.endTime).toLocaleString(
          DateTime.TIME_24_WITH_SECONDS
        )}`;
      } else {
        return "";
      }
    },
  },
  {
    field: "participants",
    headerName: "Participants",
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.participants.length}`,
  },
  {
    field: "live",
    headerName: "",
    renderCell: (params) => {
      if (params.row.endTime !== null) {
        return <ButtonLink link={`info/${params.row.id}`}>Info</ButtonLink>;
      } else {
        return <ButtonLink link={`live/${params.row.id}`}>Live</ButtonLink>;
      }
    },
    valueGetter: (params: GridValueGetterParams) => `${params.row.endTime}`,
    disableExport: true,
  },
];

const { csvOptions, printOptions } = exportOptions("Meeting List");

interface MeetingTableProps {
  meetingData: MeetingAndParticipants[];
}

export default function MeetingsTable({ meetingData }: MeetingTableProps) {
  return (
    <div style={{ height: 350, width: "100%" }}>
      <DataGrid
        sx={{
          "@media print": {
            ".MuiDataGrid-main": { color: "rgba(0, 0, 0, 0.87)" },
          },
        }}
        columns={columns}
        rows={meetingData}
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
        componentsProps={{
          toolbar: {
            csvOptions: {
              fields: [
                "id",
                "name",
                "date",
                "startTime",
                "endTime",
                "participants",
              ],
              ...csvOptions,
            },
            printOptions: {
              fields: [
                "id",
                "name",
                "date",
                "startTime",
                "endTime",
                "participants",
              ],
              ...printOptions,
            },
          },
        }}
      />
    </div>
  );
}
