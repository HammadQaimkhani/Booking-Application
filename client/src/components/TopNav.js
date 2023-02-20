/* eslint-disable jsx-a11y/anchor-is-valid */
/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

const TopNav = () => {
  const { auth } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const history = useHistory();

  const logout = () => {
    // Clear Redux State
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    // Clear Local Storage
    window.localStorage.removeItem("auth");
    history.push("/login");
  };

  return (
    <div className="nav bg-light d-flex justify-content-between">
      <Link className="nav-link" to="/">
        Home
      </Link>
      {auth && auth.token ? (
        <>
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>

          <a className="nav-link pointer" onClick={logout}>
            Logout
          </a>
        </>
      ) : (
        <>
          <Link className="nav-link" to="/register">
            Register
          </Link>
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </>
      )}
    </div>
  );
};

export default TopNav;
