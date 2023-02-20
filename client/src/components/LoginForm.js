import React from "react";

const LoginForm = ({
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <label htmlFor="name" className="form-label">
          Email
        </label>
        <input
          type="text"
          name="email"
          value={email}
          className="form-control"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={password}
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button disabled={!email || !password} className="btn btn-primary mt-2">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
