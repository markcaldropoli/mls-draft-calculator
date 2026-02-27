import { GridOptions, Theme, ThemeDefaultParams } from 'ag-grid-enterprise';
import PlayerPoints from '../models/PlayerPoints';
import SelectedPreview from './LineupOutput';
import SelectedGrid from './SelectedGrid';

interface Props {
    theme: Theme<ThemeDefaultParams>;
    loadingPlayers: boolean;
    rightRows: PlayerPoints[];
    totalRightPoints: number;
    onCopy: (text: string) => void;
    copied: boolean;
    gridOptions: GridOptions;
    columnDefs: any;
    onCellValueRightChanged: (params: any) => void;
    onGridReady: (e: any) => void;
}

export default function RightPanel({
    loadingPlayers,
    rightRows,
    totalRightPoints,
    onCopy,
    copied,
    gridOptions,
    columnDefs,
    onCellValueRightChanged,
    onGridReady,
    theme
}: Props) {
    if (loadingPlayers) {
        return null;
    }

    return (
        <div className="right">
            <div style={{ height: "100%", display: 'flex', flexDirection: 'column' }} className="no-overflow">
                <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <SelectedPreview
                        rightRows={rightRows}
                        totalRightPoints={totalRightPoints}
                        onCopy={onCopy}
                        copied={copied}
                    />

                    <div style={{ flex: '0 0 45%', minHeight: 0, overflow: 'hidden' }}>
                        <div style={{ height: '100%', minHeight: 0 }}>
                            <SelectedGrid
                                theme={theme}
                                gridOptions={gridOptions}
                                columnDefs={columnDefs}
                                rowData={rightRows}
                                loading={loadingPlayers}
                                onCellValueChanged={onCellValueRightChanged}
                                onGridReady={onGridReady}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}