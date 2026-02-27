import { GridApi, GridReadyEvent, themeQuartz } from 'ag-grid-enterprise';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import AppHeader from './components/AppHeader';
import CheckingLoginPanel from './components/CheckingLoginPanel';
import LeftPanel from './components/LeftPanel';
import LoadingPlayersPanel from './components/LoadingPlayersPanel';
import LoginPanel from './components/LoginPanel';
import RightPanel from './components/RightPanel';
import { DraftColumnDefs, PlayerColumnDefs } from './config/columnDefinitions';
import { getGridOptions } from './config/gridOptions';
import { MatchSchedule2026 } from './config/matchSchedule';
import { useFetchPlayers } from "./hooks/useFetchPlayers";
import { usePlayerPoints } from './hooks/usePlayerPoints';
import Player from './models/Player';
import PlayerPoints from './models/PlayerPoints';
import { clearToken, getValidToken, storeToken } from './services/TokenService';

const TEAM_IDS = [198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227];
const TEAM_URLS = TEAM_IDS.map(id => `https://api.kickbase.com/v4/competitions/9/teams/${id}/teamprofile`);
const DIVISION_CHAMPIONS = 'Champions' as const;

const App: React.FC = () => {
    const gridApi = useRef<GridApi<Player> | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [checking, setChecking] = useState(true);
    const [leftRows, setLeftRows] = useState<Player[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [subCache, setSubCache] = useState<Record<string, boolean>>({});
    const [copied, setCopied] = useState(false);
    const [division, setDivision] = useState<'Champions' | 'Lower'>(DIVISION_CHAMPIONS);

    const possibleChampWeeks = useMemo(() => {
        return Array.from(new Set(MatchSchedule2026.map(m => m.champDraftWeek).filter((v): v is number => v != null))).sort((a, b) => a - b);
    }, []);

    const possibleLowerWeeks = useMemo(() => {
        return Array.from(new Set(MatchSchedule2026.map(m => m.lowerDraftWeek).filter((v): v is number => v != null))).sort((a, b) => a - b);
    }, []);

    const mostRecentPassed = useMemo(() => {
        const now = new Date();
        const passed = MatchSchedule2026.filter(m => m.endDate && m.endDate <= now);

        if (passed.length === 0) {
            return null;
        }

        return passed.reduce((prev, cur) => (cur.endDate! > prev.endDate! ? cur : prev));
    }, []);

    const initialDraftWeek = useMemo<number | null>(() => {
        if (mostRecentPassed) {
            return division === DIVISION_CHAMPIONS ? mostRecentPassed.champDraftWeek ?? null : mostRecentPassed.lowerDraftWeek ?? null;
        }
        return division === DIVISION_CHAMPIONS ? (possibleChampWeeks[0] ?? null) : (possibleLowerWeeks[0] ?? null);
    }, [division, possibleChampWeeks.length, possibleLowerWeeks.length, mostRecentPassed]);

    const [draftWeek, setDraftWeek] = useState<number | null>(initialDraftWeek);

    const { pointsCache, mpCache } = usePlayerPoints(leftRows, selectedIds, draftWeek, division);

    const rightRows = useMemo<PlayerPoints[]>(
        () => leftRows.filter(p => selectedIds.has(String(p.i))).map(p => {
            const key = `${p.i}_${division}_${draftWeek ?? 'null'}`;
            return {
                sub: subCache[String(p.i)] ?? false,
                i: String(p.i),
                n: p.n,
                pos: p.pos,
                tn: p.tn,
                mp: String(mpCache[key] ?? "DNP"),
                p: pointsCache[key] ?? 0
            };
        }),
        [leftRows, pointsCache, mpCache, subCache, selectedIds, draftWeek, division]
    );

    const totalRightPoints = useMemo(() => rightRows.reduce((sum, r) => sum +(r.p ?? 0), 0), [rightRows]);

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            (document as any).execCommand('copy');
            document.body.removeChild(ta);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fetchUrls = useMemo(() => token ? TEAM_URLS : [], [token]);
    const { data: players, loading: loadingPlayers } = useFetchPlayers<Player>(fetchUrls);

    const gridOptions = useMemo(() => getGridOptions(), []);

    const onGridReady = useCallback((event: GridReadyEvent) => {
        gridApi.current = event.api;
    }, []);

    const onCellValueRightChanged = useCallback((params: any) => {
        const id = String(params.data?.i ?? params.data?.id ?? '');
        const field = (params.colDef && params.colDef.field) || params.colId;

        if (!id) {
            return;
        }

        if (field === 'sub') {
            setSubCache(prev => ({ ...prev, [id]: !!params.data.sub }));
        }
    }, [setSubCache]);

    const onSelectionChanged = useCallback((event: any) => {
        const rows = event.api.getSelectedRows() as Player[];
        setSelectedIds(new Set(rows.map(r => String(r.i))));
    }, []);

    useEffect(() => {
        (async () => {
            const t = await getValidToken();
            setToken(t);
            setChecking(false);
        })();
    }, []);

    useEffect(() => {
        const opts = division === DIVISION_CHAMPIONS ? possibleChampWeeks : possibleLowerWeeks;
        const preferred = mostRecentPassed ? (division === DIVISION_CHAMPIONS ? mostRecentPassed.champDraftWeek : mostRecentPassed.lowerDraftWeek) : null;

        if (preferred != null && opts.includes(preferred)) {
            setDraftWeek(preferred);
            return;
        }

        if (draftWeek == null || !opts.includes(draftWeek)) {
            setDraftWeek(opts[0] ?? null);
        }
    }, [division, possibleChampWeeks.length, possibleLowerWeeks.length, mostRecentPassed]);

    useEffect(() => {
        if (players) {
            setLeftRows(players);
        }
    }, [players]);

    if (checking) {
        return <CheckingLoginPanel />;
    }

    if (!token) {
        return <LoginPanel onSuccess={(t) => { storeToken(t); setToken(t); }} />;
    }

    if (loadingPlayers) {
        return <LoadingPlayersPanel />;
    }

    return (
        <div className="App" style={{background:"#b7c7dd"}}>
            <AppHeader
                division={division}
                setDivision={setDivision}
                draftWeek={draftWeek}
                setDraftWeek={setDraftWeek}
                possibleChampWeeks={possibleChampWeeks}
                possibleLowerWeeks={possibleLowerWeeks}
                onSignOut={() => { clearToken(); setToken(null); }}
            />

            <div className='grid-container'>
                <LeftPanel
                    theme={themeQuartz}
                    loadingPlayers={loadingPlayers}
                    leftRows={leftRows}
                    gridOptions={gridOptions}
                    columnDefs={PlayerColumnDefs}
                    onSelectionChanged={onSelectionChanged}
                    onGridReady={onGridReady}
                />

                <RightPanel
                    theme={themeQuartz}
                    loadingPlayers={loadingPlayers}
                    rightRows={rightRows}
                    totalRightPoints={totalRightPoints}
                    onCopy={handleCopy}
                    copied={copied}
                    gridOptions={gridOptions}
                    columnDefs={DraftColumnDefs}
                    onCellValueRightChanged={onCellValueRightChanged}
                    onGridReady={onGridReady}
                />
            </div>
        </div>
    );
}

export default App;
