import { useCallback, useEffect, useState } from "react";

type UseRefreshResponse = [shouldRefresh: boolean, refresh: () => void];

export function useRefresh(): UseRefreshResponse {
  const [shouldRefresh, setShouldRefresh] = useState(true);

  const refresh = useCallback(() => {
    setShouldRefresh(true);
  }, [setShouldRefresh]);

  useEffect(() => {
    if (shouldRefresh) {
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  return [shouldRefresh, refresh];
}
