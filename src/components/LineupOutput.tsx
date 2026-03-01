import React, { useMemo } from 'react';
import PlayerPoints from '../models/PlayerPoints';

type Props = {
    rightRows: PlayerPoints[];
    totalRightPoints: number;
    onCopy: (text: string) => void;
    copied: boolean;
};

const posLabel = (pos: number | string) => {
    const map: Record<string, string> = { '1': 'GK', '2': 'DEF', '3': 'MID', '4': 'FWD' };
    return map[String(pos)] ?? String(pos).toUpperCase();
};

const LineupOutput: React.FC<Props> = ({ rightRows, totalRightPoints, onCopy, copied }) => {
    const formattedRightGridText = useMemo(() => {
        const groups: Record<string, PlayerPoints[]> = {};
        const subs: PlayerPoints[] = [];

        for (const r of rightRows) {
            if (r.sub) {
                subs.push(r);
                continue;
            }

            const label = posLabel(r.pos);
            groups[label] = groups[label] ?? [];
            groups[label].push(r);
        }

        const order = ['GK', 'DEF', 'MID', 'FWD'];
        const lines: string[] = [];

        for (const label of order) {
            const list = groups[label];

            if (!list || list.length === 0) {
                continue;
            }

            for (const p of list) {
                const ptsText = (p.mp === "0'") ? 'DNP' : String(p.p ?? 0);
                lines.push(`${label} - ${p.n}: ${ptsText}`);
            }

            lines.push('');
        }

        if (lines.length && lines[lines.length - 1] === '') {
            lines.pop();
        }

        if (subs.length) {
            if (lines.length) {
                lines.push('');
            }

            for (const s of subs) {
                const ptsText = (s.mp === "0'") ? 'DNP' : String(s.p ?? 0);
                lines.push(`SUB - ${s.n}: ${ptsText}`);
            }
        }

        if (lines.length) {
            lines.push('');
        }

        lines.push(`Total: ${totalRightPoints}`);

        return lines.join('\n');
    }, [rightRows, totalRightPoints]);

    return (
        <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'transparent', paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className='btn btn-sm fw-semibold' style={{ fontFamily: 'IBM Plex Sans', background: '#1f2e4f', color: '#b7c7dd' }} onClick={() => onCopy(formattedRightGridText)}>Copy Text</button>
                        {copied && <span style={{ fontFamily: 'IBM Plex Sans', color: '#1f2d4f' }}>Copied!</span>}
                    </div>
                    <div style={{ color: '#1f2d4f', fontFamily: 'IBM Plex Sans', fontSize: 16, fontWeight: 'bold', textAlign: 'right' }}>
                        Total Points: {totalRightPoints}
                    </div>
                </div>
            </div>

            <div style={{ overflow: 'auto' }}>
                <pre style={{ fontFamily: 'IBM Plex Sans', whiteSpace: 'pre-wrap', background: '#f6f8fb', padding: 10, borderRadius: 4 }}>{formattedRightGridText}</pre>
            </div>
        </div>
    );
};

export default LineupOutput;