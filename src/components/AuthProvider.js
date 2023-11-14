import React, { useState, useEffect, createContext, useContext } from 'react';
import jwt_decode from "jwt-decode";


// Create an authentication context
const AuthContext = createContext();

// AuthProvider component to manage authentication state
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize with null or user data

  useEffect(() => {
    // Check for an existing token in local storage when the component mounts
    const storedToken = localStorage.getItem('jwtToken');

    if (storedToken) {
      try{
        // Decode the token to get its expiration date
        const decodedToken = jwt_decode(storedToken);

        // Check if the token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          // Token is not expired, set the user state
          setUser({ token: storedToken, userId: decodedToken.userId });
        } else {
          // Token is expired, remove it from local storage and reset user state
          localStorage.removeItem('jwtToken');
          setUser(null);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []); // Empty dependency array ensures this effect runs once on mount

  const login = (token) => {
    // Store the token in local storage and set the user state
    localStorage.setItem('jwtToken', token);
    const decodedToken = jwt_decode(token);
    setUser({ token: token, userId: decodedToken.userId });
  };

  //TODO LOGOUT
  // const logout = () => {
  //   const storedToken = localStorage.getItem('jwtToken');

  //   if (storedToken) {
  //     try{
  //       // Decode the token to get its expiration date
  //       const decodedToken = jwt_decode(storedToken);
  //       // Remove locally stored token
  //       localStorage.removeItem('jwtToken');
  //       // Call logout route
  //       fetch('https://cold-bush-9506.fly.dev/users/logout', {
  //         method: 'POST',
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           userId: decodedToken.userId,
  //         })
  //       });

  //     } catch (error) {
  //       console.error('Error decoding token:', error);
  //     }
  //   }
  //   // Remove the user from the state
  //   setUser(null);
  // };

  return (
    <AuthContext.Provider value={{ user, login}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
