import { useState, createContext } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
	const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

	if (!isAuthenticated && !isLoading) {
		loginWithRedirect();
	}

	return (
		<>
			<h1 className="mb-10">Event App</h1>
			<Outlet />
		</>
	);
}

export default App;
