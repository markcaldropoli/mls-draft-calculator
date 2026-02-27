import { useCallback, useEffect, useRef, useState } from 'react';
import { getValidToken } from '../services/TokenService';

async function fetchWithAuthorization(url: string, signal?: AbortSignal): Promise<Response> {
    const token = await getValidToken();

    if (!token) {
        throw new Error("Authorization token is missing");
    }

    return fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        signal
    });
}

export function useFetchPlayers<T = any>(urls: string | string[]) {
    const [data, setData] = useState<T[] | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();

    const urlRef = useRef<string | string[]>(urls);
    const controllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (u: string | string[]) => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setError(undefined);

        try {
            const list = Array.isArray(u) ? u : [u];
            const responses = await Promise.all(list.map(url => fetchWithAuthorization(url, controller.signal)));

            for (const r of responses) {
                if (!r.ok) {
                    throw new Error(`HTTP error! status: ${r.status}`);
                }
            }

            const jsons = await Promise.all(responses.map(r => r.json()));
            const merged = jsons.flatMap((j: any) => {
                const arr = j?.["it"] ?? [];

                if (!Array.isArray(arr)) {
                    return [];
                }

                return arr.map((item: any) => ({ ...item, selected: false, tn: j?.tn }));
            });

            setData(merged.sort((a, b) => a.n.localeCompare(b.n)));
        }
        catch (err: any) {
            if (err?.name === 'AbortError') {
                // aborted, do nothing
            }
            else {
                setError(err);
            }
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        urlRef.current = urls;
        fetchData(urls);
        return () => {
            controllerRef.current?.abort();
        };
    }, [urls, fetchData]);

    const refetch = useCallback(() => {
        fetchData(urlRef.current);
    }, [fetchData]);

    return { data, loading, error, refetch };
}