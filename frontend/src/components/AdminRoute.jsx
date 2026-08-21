import { Navigate } from "react-router-dom";


function AdminRoute({ children }) {

  const token =
    localStorage.getItem(
      "authToken"
    );

  const user = JSON.parse(
    localStorage.getItem(
      "authUser"
    ) || "null"
  );


  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  if (
    user.role !== "super_admin" &&
    user.role !== "admin"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  return children;
}


export default AdminRoute;