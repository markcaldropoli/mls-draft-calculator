import { GridOptions } from 'ag-grid-enterprise';
import Player from '../models/Player';

export const getGridOptions = (): GridOptions<Player> => ({
    suppressAggFuncInHeader: true,
    animateRows: true,
    rowData: null,
    accentedSort: true,
    loadThemeGoogleFonts: true,
    suppressScrollOnNewData: true,
    getRowId: params => String(params.data.i),
    defaultColDef: {
        editable: false,
        filter: true,
        sortable: true,
        cellStyle: { textAlign: 'left', fontSize: '16px' },
    },
});