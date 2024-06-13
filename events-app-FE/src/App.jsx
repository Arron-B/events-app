import { useState, createContext } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Calendar from "./components/Calendar.jsx";
import { fetchUserById } from "./api.js";

function App() {
	const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

	if (!isAuthenticated && !isLoading) {
		loginWithRedirect();
	}

	return (
		<>
			<h1 className="mb-10">Event App</h1>
			<Calendar />
			<Outlet />
		</>
	);
}

export default App;
