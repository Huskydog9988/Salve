import { GridCsvExportOptions, GridPrintExportOptions } from "@mui/x-data-grid";

export const exportOptions = (meetingName: string) => {
  const fileName = `${meetingName} - Salve`;

  const csvOptions: GridCsvExportOptions = {
    fileName,
    utf8WithBom: true,
  };

  const printOptions: GridPrintExportOptions = {
    hideToolbar: true,
    fileName,
  };

  return { csvOptions, printOptions };
};
