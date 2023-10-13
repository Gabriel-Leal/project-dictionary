import { useEffect, useState } from "react";

const INITIAL_ITEMS = 24;
const LOAD_MORE_ITEMS = 9;
const DATA_LOAD_DELAY = 2000;

export const usePagination = <T>(data: T[]) => {
  const [visibleData, setVisibleData] = useState<T[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  useEffect(() => {
    setVisibleData(data.slice(0, INITIAL_ITEMS));
  }, [data]);
  const handleLoadMoreData = () => {
    if (!scrollOffset || loadingMore || allDataLoaded) return;

    setLoadingMore(true);

    setTimeout(() => {
      const currentLength = visibleData ? visibleData.length : 0;
      const nextData = data.slice(
        currentLength,
        currentLength + LOAD_MORE_ITEMS
      ) as string[];

      if (!nextData.length) setAllDataLoaded(true);

      setVisibleData((prevData = []) => [...prevData, ...nextData as T[]]);
      setLoadingMore(false);
    }, DATA_LOAD_DELAY);
    
  };

  return {
    visibleData,
    loadingMore,
    allDataLoaded,
    handleLoadMoreData,
    setScrollOffset,
  };
};
