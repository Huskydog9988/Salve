import * as React from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueGetterParams,
  MuiEvent,
} from "@mui/x-data-grid";
import { MeetingAndParticipants } from "./shared/meetingAndParticipants";
import { DateTime } from "luxon";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", type: "number", width: 100 },
  {
    field: "name",
    headerName: "Name",
    width: 230,
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    valueGetter: (params: GridValueGetterParams) =>
      `${DateTime.fromISO(params.row.startTime).toLocaleString(
        DateTime.DATE_MED
      )}`,
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
    valueGetter: (params: GridValueGetterParams) =>
      `${DateTime.fromISO(params.row.endTime).toLocaleString(
        DateTime.TIME_24_WITH_SECONDS
      )}`,
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
    headerName: "Live",
    width: 160,
    valueGetter: (params: GridValueGetterParams) => {
      let link;

      if (params.row.endTime !== null) {
        return "Info";
      } else {
        return "Live";
      }
    },
  },
];

interface MeetingTableProps {
  meetingData: MeetingAndParticipants[];
}

export default function MeetingsTable({ meetingData }: MeetingTableProps) {
  // const rows: number | string | null[] = [];

  // let x: number;
  // for (x = 0; x > meetingsData.length; x++) {
  //   console.log(`${meetingsData[x]}::::`);
  //   rows.push([
  //     name: meetingsData[x].name,
  //     startTime: meetingsData[x].startTime,
  //     endTime: meetingsData[x].endTime,
  //     amount: meetingsData[x].participants,
  //     id: meetingsData[x].id,
  //   ]);
  // }
  // console.log(rows + " <==");

  // const test = [
  //   {
  //     id: 1,
  //     name: "Na",
  //     startTime: new Date().toISOString(),
  //     endTime: new Date().toISOString(),
  //     participants: [],
  //   },
  // ];

  return (
    <div style={{ height: 350, width: "100%" }}>
      <DataGrid
        columns={columns}
        rows={meetingData}
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
          event.defaultMuiPrevented = true;
          let link;
          if (params.row.endTime !== null) {
            link = `info/${params.row.id}`;
          } else {
            link = `join/${params.row.id}`;
          }
          window.location.href = link;
        }}
      />
    </div>
  );
}
