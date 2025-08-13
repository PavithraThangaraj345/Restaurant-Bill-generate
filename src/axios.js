import axios from "axios";

const instance = axios.create({
  baseURL: "https://restaurant-bill-generate-backend.onrender.com/api", 
});

export default instance;
