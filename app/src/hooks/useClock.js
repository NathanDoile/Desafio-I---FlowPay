import { useEffect, useRef, useState, useCallback } from "react";

export function useClock(intervalMs = 1000) {
  const anchorRef = useRef(null);
  const [now, setNow] = useState(null);
  const [anchor, setAnchor] = useState(null);

  useEffect(() => {
    const start = Date.now();
    anchorRef.current = start;
    setAnchor(start);
    setNow(start);
    
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    
    return () => clearInterval(id);
  }, [intervalMs]);

  const resetAnchor = useCallback(() => {
    const current = Date.now();
    anchorRef.current = current;
    setAnchor(current);
    setNow(current);
  }, []);

  return { anchor, now, resetAnchor };
}