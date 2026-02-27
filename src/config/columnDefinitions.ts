import { ColDef } from "ag-grid-enterprise";

export const PlayerColumnDefs: ColDef[] = [
    {
        field: "i",
        headerName: "Player ID",
        width: 130
    },
    {
        headerName: 'Name',
        field: 'n',
        filterParams: {
            textFormatter: removeDiacritics,
            debounceMs: 200
        },
        getQuickFilterText: (params) => removeDiacritics(params && params.value),
        width: 180
    },
    {
        field: "pos",
        headerName: "Position",
        width: 120,
        valueFormatter: (params) => convertNumberToPosition(params.value)
    },
    {
        field: "tn",
        headerName: "Team Name",
        width: 220
    },
];

export const DraftColumnDefs: ColDef[] = [
    {
        field: 'sub',
        headerName: 'Sub?',
        cellRenderer: 'agCheckboxCellRenderer',
        cellEditor: 'agCheckboxCellEditor',
        editable: true,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        width: 90
    },
    {
        headerName: 'Name',
        field: 'n',
        filterParams: {
            textFormatter: removeDiacritics,
            debounceMs: 200
        },
        getQuickFilterText: (params) => removeDiacritics(params && params.value),
        width: 180
    },
    {
        field: "pos",
        headerName: "Position",
        width: 120,
        valueFormatter: (params) => convertNumberToPosition(params.value)
    },
    {
        field: "tn",
        headerName: "Team Name",
        width: 220
    },
    {
        field: "p",
        headerName: "Points",
        width: 110
    },
    {
        field: "mp",
        headerName: "Minutes Played",
        width: 160
    }
];

function convertNumberToPosition(num: number): string {
    switch (num) {
        case 1:
            return "GK";
        case 2:
            return "DEF";
        case 3:
            return "MID";
        case 4:
            return "FWD";
        default:
            return "Unknown";
    }
}

function removeDiacritics(value: string | null | undefined): string {
  if (!value) return '';
  // decompose accents then strip combining marks
  return value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}