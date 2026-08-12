import { useEffect, useRef, useState } from "react";

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

  return { anchor, now };
}