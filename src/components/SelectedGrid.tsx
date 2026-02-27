import { GridReadyEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import React from 'react';
import PlayerPoints from '../models/PlayerPoints';

type Props = {
    theme: any;
    gridOptions?: any;
    columnDefs: any;
    rowData: PlayerPoints[];
    loading: boolean;
    onCellValueChanged?: (params: any) => void;
    onGridReady?: (event: GridReadyEvent) => void;
};

const SelectedGrid: React.FC<Props> = ({ theme, columnDefs, rowData, loading, onCellValueChanged, onGridReady, gridOptions }) => {
    const gridTheme = theme.withParams({
        backgroundColor: '#354377',
        foregroundColor: '#b7c7dd',
        headerTextColor: '#9cb7d9',
        headerBackgroundColor: '#1f2e4f',
        oddRowBackgroundColor: 'rgb(0, 0, 0, 0.1)',
        headerColumnResizeHandleColor: '#5c842e',
        rowVerticalPaddingScale: 0.5,
    });

    return (
        <AgGridReact
            theme={gridTheme}
            gridOptions={gridOptions}
            columnDefs={columnDefs}
            rowData={rowData}
            onCellValueChanged={onCellValueChanged}
            onGridReady={onGridReady}
            loading={loading}
            defaultExcelExportParams={{ columnKeys: columnDefs.map((col: any) => col.field as string) }}
        />
    );
};

export default SelectedGrid;