import { useEffect, useRef } from 'react';

export function useSmartPolling(callback, intervalMs = 10000) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const executeCallbackIfVisible = () => {
      if (document.visibilityState === 'visible') {
        savedCallback.current();
      }
    };

    const intervalId = setInterval(executeCallbackIfVisible, intervalMs);

    document.addEventListener('visibilitychange', executeCallbackIfVisible);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', executeCallbackIfVisible);
    };
  }, [intervalMs]);
}