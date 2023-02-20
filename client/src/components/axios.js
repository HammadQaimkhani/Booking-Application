import axios from "axios";

const instace = axios.create({
  baseURL: "http://localhost:8000/api",
});

export default instace;
