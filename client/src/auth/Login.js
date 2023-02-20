/** @format */

import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import { login } from "../actions/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //
    try {
      const { data } = await login({ email, password });
      if (data) {
        // Save token in local storage and redux state
        window.localStorage.setItem("auth", JSON.stringify(data));

        dispatch({
          type: "LOGGED_IN_USER",
          payload: data,
        });
      }
      history.push("/dashboard");
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) toast.error(err.response.data);
    }
  };

  return (
    <>
      <div className="container-fluid bg-secondary p-5 text-center">
        <h1>Login Page</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-3">
            <LoginForm
              handleSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
