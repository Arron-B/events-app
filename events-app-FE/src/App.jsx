import { useState, useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Calendar from "./components/Calendar.jsx";
import LogoutButton from "./components/LogoutButton.jsx";
import Nav from "./components/Nav.jsx";
import { fetchUserById, postNewUser } from "./api.js";

function App() {
	const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
	const [userData, setUserData] = useState("");

	if (!isAuthenticated && !isLoading) {
		loginWithRedirect();
	}

	function combineUserData(authUser, dbUser) {
		const userCombine = { ...dbUser };
		userCombine.picture = authUser.picture;
		userCombine.email = authUser.email;
		setUserData(userCombine);
	}

	useEffect(() => {
		if (isAuthenticated) {
			fetchUserById(user.sub)
				.then((res) => {
					combineUserData(user, res.data.user);
				})
				.catch((err) => {
					console.log(err);
					postNewUser(user, user.name)
						.then((res) => {
							combineUserData(user, res.data.user);
						})
						.catch((err) => {
							console.log(err);
						});
				});
		}
	}, [isAuthenticated]);

	return (
		<>
			<Nav user={userData} />
			<Calendar user={userData} />

			<LogoutButton />
			<Outlet />
		</>
	);
}

export default App;
