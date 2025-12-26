import { useQuery } from "@tanstack/react-query";
import { getAuthAdmin } from "../lib/api";

const useAdminAuth = () => {
  const query = useQuery({
    queryKey: ["authAdmin"],
    queryFn: getAuthAdmin,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    isLoading: query.isLoading,
    isAdmin: query.data?.success === true,
    isError: query.isError,
  };
};

export default useAdminAuth;
