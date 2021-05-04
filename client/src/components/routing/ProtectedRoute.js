import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Spinner from "react-bootstrap/Spinner";
import NavbarMenu from "../layouts/NavbarMenu";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);

  if (authLoading) {
    return (
      <div className="spinner-container">
        <Spinner animation="boder" variant="info" />
      </div>
    );
  } else {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <>
              <NavbarMenu />
              <Component {...rest} {...props} />
            </>
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  }
};

export default ProtectedRoute;
