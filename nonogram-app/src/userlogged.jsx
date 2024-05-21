import React, { createContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateLoginStatus = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, updateLoginStatus }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
