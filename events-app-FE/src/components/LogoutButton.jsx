import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export default function LogoutButton() {
	const { logout } = useAuth0();

	return (
		<button
			type="button"
			className="relative w-[20%] inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
			onClick={() =>
				logout({ logoutParams: { returnTo: "http://localhost:5173/" } })
			}
		>
			Log Out
		</button>
	);
}
