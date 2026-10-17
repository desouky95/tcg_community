
type UseSearchParamArgs = {
  param: string;
  searchParams: URLSearchParams;
  onChange?: () => void;
};

const isServer = typeof window === "undefined";

export const useSearchParam = ({
  param,
  onChange,
  searchParams,
}: UseSearchParamArgs) => {
  const paramValue = searchParams.get(param);

  return [
    paramValue,
    (value: string) => {
      searchParams.set(param, value);
      onChange?.();
    },
  ] as const;
};
