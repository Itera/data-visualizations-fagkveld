import { useState, useEffect, DependencyList } from "react";
import { useRefresh } from "./refresh";

type UsePromiseReponse<T> = [
  isResolving: boolean,
  data: T | null,
  error: Error | null,
  refreshData: () => void
];

export function usePromise<T>(
  resolve: () => Promise<T>,
  deps: DependencyList
): UsePromiseReponse<T> {
  const [isResolving, setIsResolving] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [shouldRefresh, refresh] = useRefresh();

  useEffect(() => {
    if (shouldRefresh) {
      setIsResolving(true);
      resolve()
        .then((d) => {
          setData(d);
          setError(null);
          setIsResolving(false);
        })
        .catch((e) => {
          setError(e);
          setData(null);
          setIsResolving(false);
        });
    }
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...deps,
    resolve,
    setIsResolving,
    setData,
    setError,
    shouldRefresh,
  ]);

  return [isResolving, data, error, refresh];
}
