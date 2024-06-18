import { HomeIcon } from "@heroicons/react/20/solid";
import { useUser } from "../UserContext.jsx";

export default function Nav() {
	const user = useUser();

	return user ? (
		<nav
			className="flex w-full justify-around fixed top-5 portrait:justify-between portrait:px-5"
			aria-label="Breadcrumb"
		>
			<a
				href="/"
				className="text-gray-400 hover:text-gray-500"
			>
				<HomeIcon
					className="h-8 w-8 flex-shrink-0"
					aria-hidden="true"
				/>
				<span className="sr-only">Home</span>
			</a>

			<a
				href="#"
				className="group block flex-shrink-0"
			>
				<div className="flex items-center">
					<div>
						<img
							className="inline-block h-9 w-9 rounded-full"
							src={
								user.picture
									? user.picture
									: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/user-profile-icon.png"
							}
							alt=""
						/>
					</div>
					<div className="ml-3">
						<p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
							{user.name}
						</p>
					</div>
				</div>
			</a>
		</nav>
	) : null;
}