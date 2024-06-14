import React, { createContext, useContext } from "react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children, value }) => {
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
