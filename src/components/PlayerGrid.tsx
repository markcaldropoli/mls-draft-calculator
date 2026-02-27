import { GridReadyEvent, MultiRowSelectionOptions } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import React, { useMemo } from 'react';
import Player from '../models/Player';

type Props = {
    theme: any;
    gridOptions?: any;
    columnDefs: any;
    rowData: Player[];
    loading: boolean;
    onCellValueChanged?: (params: any) => void;
    onGridReady?: (event: GridReadyEvent) => void;
    onSelectionChanged?: (event: any) => void;
};

const PlayerGrid: React.FC<Props> = ({ theme, columnDefs, rowData, loading, onCellValueChanged, onGridReady, gridOptions, onSelectionChanged }) => {
    const gridTheme = theme.withParams({
        backgroundColor: '#354377',
        foregroundColor: '#b7c7dd',
        headerTextColor: '#9cb7d9',
        headerBackgroundColor: '#1f2e4f',
        oddRowBackgroundColor: 'rgb(0, 0, 0, 0.1)',
        headerColumnResizeHandleColor: '#5c842e',
        rowVerticalPaddingScale: 0.5,
    });

    const rowSelection = useMemo<"single" | "multiple" | MultiRowSelectionOptions>(() => {
        return {
            mode: 'multiRow',
            headerCheckbox: false,
            enableClickSelection: false
        };
    }, []);

    return (
        <AgGridReact
            theme={gridTheme}
            gridOptions={gridOptions}
            rowSelection={rowSelection}
            onSelectionChanged={onSelectionChanged}
            columnDefs={columnDefs}
            rowData={rowData}
            onCellValueChanged={onCellValueChanged}
            onGridReady={onGridReady}
            loading={loading}
            defaultExcelExportParams={{ columnKeys: columnDefs.map((col: any) => col.field as string) }}
        />
    );
};

export default PlayerGrid;