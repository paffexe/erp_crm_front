import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../useAxios/useAxios";
import type { QueryType } from "@/types";

export const useGetQuery = ({ pathname, url, param }: QueryType) => {
  const axios = useAxios();

  return useQuery({
    queryKey: [pathname],
    queryFn: () => axios({ url, param }).then((res) => res),
  });
};
