import { useQuery } from "@tanstack/react-query";
import { getAuthAdmin } from "../lib/api";
import { useAuth } from "@clerk/clerk-react";

const useAdminAuth = () => {
  const { getToken } = useAuth();
  
  const query = useQuery({
    queryKey: ["authAdmin"],
    queryFn: async () => {
      const token = await getToken(); // get Clerk token
      return getAuthAdmin(token); // pass token to API call
    },
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
