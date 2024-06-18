import { useState, useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { UserProvider } from "./UserContext.jsx";
import Nav from "./components/Nav.jsx";
import { fetchUserById, postNewUser } from "./api.js";
import Loading from "./components/Loading.jsx";

function App() {
	const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
	const [userData, setUserData] = useState(null);

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
					postNewUser(user.sub, user.name)
						.then((res) => {
							combineUserData(user, res.data.user);
						})
						.catch((err) => {
						});
				});
		}
	}, [isAuthenticated]);

	return userData ? (
		<UserProvider value={userData}>
			<Nav />

			<Outlet setUser={setUserData} />
		</UserProvider>
	) : (
		<Loading />
	);
}

export default App;
