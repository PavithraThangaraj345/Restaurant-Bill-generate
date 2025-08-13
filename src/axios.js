import axios from "axios";

const instance = axios.create({
  baseURL: "https://restaurant-bill-generate-backend-1.onrender.com", 
});

export default instance;
