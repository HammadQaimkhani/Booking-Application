import axios from "../components/axios";

export const register = async (user) => await axios.post("/register", user);

export const login = async (user) => await axios.post("/login", user);

// update user in local Storage

export const updateUserInLocalStorage = (user, next) => {
  if (window.localStorage.getItem("auth")) {
    let auth = JSON.parse(localStorage.getItem("auth"));
    auth.user = user;
    localStorage.setItem("auth", JSON.stringify(auth));
    next();
  }
};
