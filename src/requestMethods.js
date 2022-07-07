import axios from "axios";
const url = "https://guy221293.pythonanywhere.com/";
export const BASE_URL = url;
// const TOKEN =
//   JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser
//     .accessToken || "";

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.token;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
 
export const parseRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    "content-type": "multipart/form-data",
    "Authorization": `Token ${TOKEN}`, 
  }
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { 
    "Authorization": `Token ${TOKEN}`, 
  },
});

