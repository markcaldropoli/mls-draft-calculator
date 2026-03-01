import { GridOptions, Theme, ThemeDefaultParams } from 'ag-grid-enterprise';
import React, { useEffect, useState } from 'react';
import Player from '../models/Player';
import PlayerGrid from './PlayerGrid';
import TeamManager from './TeamManager';

interface Props {
    theme: Theme<ThemeDefaultParams>;
    gridOptions: GridOptions;
    columnDefs: any;
    loadingPlayers: boolean;
    leftRows: Player[];
    selectedIds: Set<string>;
    setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
    getRowId: (params: any) => string;
    onSelectionChanged: (e: any) => void;
    onGridReady: (e: any) => void;
}

export default function LeftPanel({
    theme,
    gridOptions,
    columnDefs,
    loadingPlayers,
    leftRows,
    selectedIds,
    setSelectedIds,
    getRowId,
    onSelectionChanged,
    onGridReady
}: Props) {    
    const [leftGridApi, setLeftGridApi] = useState<any>(null);
    const mergedGridOptions: GridOptions = { ...gridOptions, getRowId };

    useEffect(() => {
        const api = leftGridApi;

        if (!api || typeof api.forEachNode !== 'function') {
            return;
        }

        api.forEachNode((node: any) => {
            const id = String(node.data?.i ?? '');
            const shouldSelect = selectedIds.has(id);
            node.setSelected(shouldSelect, false);
        });
    }, [selectedIds, leftGridApi]);

    if (loadingPlayers) {
        return null;
    }

    return (
        <div className="left">
            <div style={{ height: "100%", display: 'flex', flexDirection: 'column' }} className="no-overflow">
                <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'transparent', paddingBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
                        <TeamManager selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
                    </div>
                </div>

                <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                        <PlayerGrid
                        theme={theme}
                        gridOptions={mergedGridOptions}
                        columnDefs={columnDefs}
                        rowData={leftRows}
                        loading={loadingPlayers}
                        onSelectionChanged={onSelectionChanged}
                        onGridReady={(e: any) => {
                            setLeftGridApi(e.api);
                            onGridReady && onGridReady(e);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}