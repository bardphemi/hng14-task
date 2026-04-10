//third-party libraries
import axios from "axios";
import http from "http";
import https from "https";

// create axios instance
export const axiosInstance = axios.create({
  timeout: 3000,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

