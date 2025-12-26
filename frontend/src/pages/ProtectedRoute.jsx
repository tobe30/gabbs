import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/Loading";
import useAdminAuth from "../hooks/useAuthAdmin";

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isLoading, isAdmin, isError } = useAdminAuth();

  if (isError) {
  return <Navigate to="/" replace />;
}


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }



  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
