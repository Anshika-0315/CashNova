import API from '../api/apidata'; // your configured axios instance

export const getCSRFToken = async () => {
  try {
    await API.get('/csrf/'); // Django will set csrftoken cookie
  } catch (err) {
    console.error("CSRF error:", err);
  }
};