"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to handle hydration mismatches
 * Returns true only after the component has mounted on the client
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
