import React from 'react';

interface Props {
    selectedIds: Set<string>;
    setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const MY_TEAM_KEY = 'mls_my_team';
const OPP_TEAM_KEY = 'mls_opponent_team';

export default function TeamManager({ selectedIds, setSelectedIds }: Props) {
    const saveTeam = (key: string) => {
        try {
            const ids = Array.from(selectedIds);
            localStorage.setItem(key, JSON.stringify(ids));
        } catch {
            // ignore
        }
    };

    const loadTeam = (key: string) => {
        let raw: string | null = null;

        try {
            raw = localStorage.getItem(key);
        } catch {
            // ignore
        }

        if (!raw) {
            return;
        }

        try {
            const ids = JSON.parse(raw) as string[];
            setSelectedIds(new Set(ids));
        } catch {
            // ignore
        }
    };

    const clearSelections = () => setSelectedIds(new Set());

    return (
        <div className="team-manager" aria-hidden={false}>
            <div className="group">
                <button type="button" className="btn btn-sm fw-semibold btn-theme" onClick={() => loadTeam(MY_TEAM_KEY)} aria-label="Load My Team">Load My Team</button>
                <button type="button" className="btn btn-sm fw-semibold btn-theme" onClick={() => saveTeam(MY_TEAM_KEY)} aria-label="Save My Team">Save My Team</button>
            </div>

            <div className="divider" />

            <div className="group">
                <button type="button" className="btn btn-sm fw-semibold btn-theme" onClick={() => loadTeam(OPP_TEAM_KEY)} aria-label="Load Opponent Team">Load Opponent Team</button>
                <button type="button" className="btn btn-sm fw-semibold btn-theme" onClick={() => saveTeam(OPP_TEAM_KEY)} aria-label="Save Opponent Team">Save Opponent Team</button>
            </div>

            <div className="divider" />

            <div className="group">
                <button type="button" className="btn btn-sm fw-semibold btn-theme" onClick={clearSelections} aria-label="Clear Selections">Clear Selections</button>
            </div>
        </div>
    );
}