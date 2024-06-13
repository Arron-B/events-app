import { useState, createContext } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Calendar from "./components/Calendar.jsx";
import LogoutButton from "./components/LogoutButton.jsx";

function App() {
	const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

	if (!isAuthenticated && !isLoading) {
		loginWithRedirect();
	}

	return (
		<>
			<Calendar />
			<LogoutButton />
			<Outlet />
		</>
	);
}

export default App;
