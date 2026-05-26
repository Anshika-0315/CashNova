// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;






// import { getCSRFToken } from '../utils/csrf';
// import API from './axios';


// // export const loginUser = async (credentials) => {
// //   await getCSRFToken(); // ✅ Fetch the CSRF token
// //   return API.post('/auth/login/', credentials); // ✅ Session + CSRF handled automatically
// // };

// export const registerUser = (data) => {
//   const formData = new FormData();
//   Object.entries(data).forEach(([key, value]) => {
//     if (value !== null && value !== undefined) {
//       formData.append(key, value);
//     }
//   });
//   return API.post('/auth/register/', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
// };
// export const logoutUser = () => API.post('/auth/logout/');

// export const getUserProfile = () => API.get('/auth/profile/');
// export const fetchFinanceSummary = () => API.get('/api/summary/');




// export const setAuthToken = (token) => {
//   if (token) {
//     API.defaults.headers.common['Authorization'] = `Token ${token}`;
//   } else {
//     delete API.defaults.headers.common['Authorization'];
//   }
// };

// export default API;
