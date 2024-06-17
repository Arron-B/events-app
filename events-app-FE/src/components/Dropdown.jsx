import {
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useUser } from "../UserContext.jsx";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Dropdown({
	setDisplay,
	display,
	upcomingEvents,
	attendingEvents,
	myEvents,
	setPage,
	setPrevDisplay,
	selection,
	setSelection
}) {

	const user = useUser();

	return (
		<Menu
			as="div"
			className="relative inline-block text-left w-full"
		>
			<div>
				<MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
					{selection}
					<ChevronDownIcon
						className="-mr-1 h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
				</MenuButton>
			</div>

			<Transition
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<MenuItem>
							{({ focus }) => (
								<option
									onClick={() => {
										setSelection("Upcoming Events");
										setPrevDisplay([...display])
										setDisplay([...upcomingEvents]);
										setPage(1)
									}}
									className={classNames(
										focus ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm",
										selection === "Upcoming Events" ? "bg-gray-300" : null
									)}
								>
									Upcoming Events
								</option>
							)}
						</MenuItem>
						<MenuItem>
							{({ focus }) => (
								<a
									onClick={() => {
										setSelection("Attending");
										setPrevDisplay([...display])
										setDisplay([...attendingEvents]);
										setPage(1)
									}}
									className={classNames(
										focus ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm",
										selection === "Attending" ? "bg-gray-300" : null
									)}
								>
									Attending
								</a>
							)}
						</MenuItem>
						<MenuItem className={!user.staff ? "hidden" : ""}>
							{({ focus }) => (
								<a
									onClick={() => {
										setSelection("My Events");
										setPrevDisplay([...display])
										setDisplay([...myEvents]);
										setPage(1)
									}}
									className={classNames(
										focus ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm",
										selection === "My Events" ? "bg-gray-300" : null
									)}
								>
									My Events
								</a>
							)}
						</MenuItem>
					</div>
				</MenuItems>
			</Transition>
		</Menu>
	);
}
