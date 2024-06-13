import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export default function LogoutButton() {
	const { logout } = useAuth0();

	return (
		<button
			className="mx-auto mt-10 col-span-2"
			onClick={() =>
				logout({ logoutParams: { returnTo: "http://localhost:5173/" } })
			}
		>
			Log Out
		</button>
	);
}
