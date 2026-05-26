import axios from 'axios';
const token = localStorage.getItem('token');
const API = axios.create({
  
  baseURL: 'http://127.0.0.1:8000/',
  withCredentials: true, // ✅ sends cookies like sessionid and csrftoken
   headers: { Authorization: `Token ${token}` }
});

API.defaults.xsrfCookieName = 'csrftoken';  // ✅ matches Django default
API.defaults.xsrfHeaderName = 'X-CSRFToken'; // ✅ Django expects this header



export default API;
