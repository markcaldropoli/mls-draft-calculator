interface Props {
    division: 'Champions' | 'Lower';
    setDivision: (d: 'Champions' | 'Lower') => void;
    draftWeek: number | null;
    setDraftWeek: (w: number | null) => void;
    possibleChampWeeks: number[];
    possibleLowerWeeks: number[];
    onSignOut: () => void;
}

export default function AppHeader({
    division,
    setDivision,
    draftWeek,
    setDraftWeek,
    possibleChampWeeks,
    possibleLowerWeeks,
    onSignOut
}: Props) {
    return (
        <header className="d-flex align-items-center justify-content-between px-4 mb-2" style={{ background: '#1f2e4f' }}>
            <div className="d-flex align-items-center" style={{ gap: 12 }}>
                <h2 className='app-title'>Fantasy MLS Draft Calculator</h2>

                <div style={{ width: 1, height: 34, background: 'rgba(255,255,255,0.12)' }} />

                <select
                    className="form-select form-select-sm"
                    value={division}
                    onChange={(e) => setDivision(e.target.value as 'Champions' | 'Lower')}
                    style={{ width: 140 }}
                >
                    <option value="Champions">Champions</option>
                    <option value="Lower">Lower</option>
                </select>

                <select
                    className="form-select form-select-sm"
                    value={draftWeek ?? ''}
                    onChange={(e) => setDraftWeek(e.target.value === '' ? null : Number(e.target.value))}
                    style={{ width: 160 }}
                >
                    {(division === 'Champions' ? possibleChampWeeks : possibleLowerWeeks).map(w => (
                        <option key={w} value={w}>{`Week ${w}`}</option>
                    ))}
                </select>
            </div>

            <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={onSignOut}
                style={{ fontWeight: 'bold' }}
            >
                Sign Out
            </button>
        </header>
    );
}