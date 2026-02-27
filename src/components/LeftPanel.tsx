import { GridOptions, Theme, ThemeDefaultParams } from 'ag-grid-enterprise';
import Player from '../models/Player';
import PlayerGrid from './PlayerGrid';

interface Props {
    theme: Theme<ThemeDefaultParams>;
    loadingPlayers: boolean;
    leftRows: Player[];
    gridOptions: GridOptions;
    columnDefs: any;
    onSelectionChanged: (e: any) => void;
    onGridReady: (e: any) => void;
}

export default function LeftPanel({
    loadingPlayers,
    leftRows,
    gridOptions,
    columnDefs,
    onSelectionChanged,
    onGridReady,
    theme
}: Props) {
    if (loadingPlayers) {
        return null;
    }

    return (
        <div className="left">
            <div style={{ height: "100%", display: 'flex', flexDirection: 'column' }} className="no-overflow">
                <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    <PlayerGrid
                        theme={theme}
                        gridOptions={gridOptions}
                        columnDefs={columnDefs}
                        rowData={leftRows}
                        loading={loadingPlayers}
                        onSelectionChanged={onSelectionChanged}
                        onGridReady={onGridReady}
                    />
                </div>
            </div>
        </div>
    );
}