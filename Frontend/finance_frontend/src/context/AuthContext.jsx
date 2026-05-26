import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken } from '../api/api';
import axios from 'axios';


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
       const [user, setUser] = useState(null);

       useEffect(() => {
           const token = localStorage.getItem('token');
           if (token) {
               setUser({ token });
           }
       }, []);


//     useEffect(() => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     axios.get('/api/auth/user/', {
//       headers: { Authorization: `Token ${token}` },
//     }).then(response => {
//       setUser(response.data);
//     }).catch(() => {
//       setUser(null);
//     });
//   }
// }, []);

       const login = (token) => {
            localStorage.setItem('token', token);
            setAuthToken(token);
            setUser({ token });
       };

       const logout = () => {
           localStorage.removeItem('token');
           setUser(null);
       };

       return (
           <AuthContext.Provider value={{ user, login, logout }}>
               {children}
           </AuthContext.Provider>
       );
};
export default AuthProvider;





// import React, { createContext, useContext, useState, useEffect } from "react";
// import { loginUser, getUserProfile } from "../api/api";
// import { getCSRFToken } from "../utils/csrf";
// import toast from "react-hot-toast";
// import API from "../api/axios";
// import { setAuthToken } from '../api/api';

// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);



//   useEffect(() => {
//            const token = localStorage.getItem('token');
//            if (token) {
//                setUser({ token });
//            }
//   }, []);

//   const login = (token) => {
//             localStorage.setItem('token', token);
//             setAuthToken(token);
//             setUser({ token });
            
//   };

// //  const fetchUser = async () => {
// //   try {
// //     await getCSRFToken();               // ✅ This sets csrftoken
// //     const res = await getUserProfile(); // ✅ This sends it in X-CSRFToken
// //     setUser(res.data);
// //   } catch (err) {
// //     console.error("fetchUser failed:", err.response || err);
// //     setUser(null);
// //   }
// // };

//   // const login = async (credentials) => {
//   //   try {
//   //     await loginUser(credentials);  // ✅ starts Django session
//   //     await fetchUser();             // ✅ gets user profile
//   //     toast.success("Login successful");
//   //   } catch (err) {
//   //     toast.error("Login failed");
//   //     throw err;
//   //   }
//   // };

//   const logout = async () => {
//     try {
//       await API.post('/auth/logout/');  // logout session
//       setUser(null);
//       toast.success("Logged out");
//     } catch (err) {
//       toast.error("Logout failed");
//     }
//   };

//   // useEffect(() => {
//   //   fetchUser(); // auto-fetch on load
//   // }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;







