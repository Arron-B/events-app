import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import ErrorPage from "./error-page";
import Calendar from "./components/Calendar.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Auth0Provider
			domain="dev-02batacgo02k8aak.us.auth0.com"
			clientId="rro2yWhpij2wYtYHBTkzmmVHcGyJ0RIV"
			authorizationParams={{
				redirect_uri: "http://localhost:5173/",
			}}
		>
			<RouterProvider router={router} />
		</Auth0Provider>
	</React.StrictMode>
);
