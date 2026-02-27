import { useEffect, useState } from 'react';
import Player from '../models/Player';

export const usePlayerPoints = (leftRows: Player[], selectedIds: Set<string>, draftWeek: number | null, division: 'Champions' | 'Lower') => {
    const [pointsCache, setPointsCache] = useState<Record<string, number | null>>({});
    const [mpCache, setMpCache] = useState<Record<string, string | null>>({});

    useEffect(() => {
        const weekKey = (id: string) => `${id}_${division}_${draftWeek ?? 'null'}`;

        const idsToFetch = leftRows
            .filter(p => selectedIds.has(String(p.i)))
            .map(p => String(p.i))
            .filter(id => !(weekKey(id) in pointsCache));

        if (idsToFetch.length === 0) {
            return;
        }

        let cancelled = false;

        (async () => {
            const pointUpdates: Record<string, number | null> = {};
            const mpUpdates: Record<string, string | null> = {};

            await Promise.all(idsToFetch.map(async (id) => {
                try {
                    const url = `https://api.kickbase.com/v4/competitions/9/players/${id}/performance`;
                    const res = await fetch(url);

                    if (!res.ok) {
                        pointUpdates[weekKey(id)] = null;
                        mpUpdates[weekKey(id)] = null;
                        return;
                    }

                    const data = await res.json();
                    const season = data?.["it"]?.find((p: any) => p.ti === "2026" && p.n === "MLS");
                    const day = season?.["ph"]?.filter((p: any) => p.day === draftWeek)?.[0];
                    const mp = (day?.mp as string) ?? "DNP";
                    const pts = day?.p ?? 0;

                    pointUpdates[weekKey(id)] = Number.isFinite(pts) ? pts : 0;
                    mpUpdates[weekKey(id)] = mp;
                } catch {
                    pointUpdates[weekKey(id)] = null;
                    mpUpdates[weekKey(id)] = null;
                }
            }));

            if (cancelled) return;

            setPointsCache(prev => ({ ...prev, ...pointUpdates }));
            setMpCache(prev => ({ ...prev, ...mpUpdates }));
        })();

        return () => { cancelled = true; };
    }, [leftRows, selectedIds, draftWeek, division, pointsCache]);

    return { pointsCache, mpCache, setPointsCache, setMpCache };
};