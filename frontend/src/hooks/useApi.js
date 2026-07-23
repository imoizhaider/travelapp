import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mountedRef = useRef(true);
  const abortRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; if (abortRef.current) abortRef.current.abort(); };
  }, []);

  const run = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    if (mountedRef.current) {
      setLoading(true);
      setError('');
    }

    try {
      const response = await fetcher();

      if (!mountedRef.current || controller.signal.aborted) return null;

      setData(response.data.data !== undefined ? response.data.data : response.data);
      return response.data;
    } catch (err) {
      if (!mountedRef.current || controller.signal.aborted) return null;

      if (axios.isCancel(err) || err?.name === 'CanceledError') return null;

      setError(err?.response?.data?.message || err.message || 'Something went wrong');
      return null;
    } finally {
      if (mountedRef.current && !controller.signal.aborted) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run, setData };
}