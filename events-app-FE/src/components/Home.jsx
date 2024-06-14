import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../UserContext.jsx";
import { fetchUpcomingEvents, fetchAttending, staffVerify } from "../api.js";
import LogoutButton from "./LogoutButton.jsx";
import StaffVerifyModal from "./StaffVerifyModal.jsx";
import Event from "./Event.jsx";

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PlusIcon,
	ClipboardDocumentCheckIcon,
} from "@heroicons/react/20/solid";
import { useAuth0 } from "@auth0/auth0-react";
import Dropdown from "./Dropdown.jsx";
import PageButtons from "./PageButtons.jsx";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Home({ setUser }) {
	let [searchParams, setSearchParams] = useSearchParams();
	const [open, setOpen] = useState(false); //modal controls
	const { isAuthenticated, isLoading } = useAuth0();
	const [display, setDisplay] = useState([]);
	const [prevDisplay, setPrevDisplay] = useState([]);
	const [eventId, setEventId] = useState(searchParams.get("eventId") || null);
	const [page, setPage] = useState(1);
	const [upcomingEvents, setUpcomingEvents] = useState([]);
	const [attendingEvents, setAttendingEvents] = useState([]);
	const [myEvents, setMyEvents] = useState([]);

	const user = useUser();

	useEffect(() => {
		setEventId(searchParams.get("eventId"));
		fetchUpcomingEvents()
			.then((eventsParsed) => {
				setUpcomingEvents(eventsParsed);
				setDisplay(eventsParsed);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		fetchAttending(user.user_id)
			.then((eventsParsed) => {
				setAttendingEvents(eventsParsed);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [user]);

	const days = [
		{ date: "2021-12-27" },
		{ date: "2021-12-28" },
		{ date: "2021-12-29" },
		{ date: "2021-12-30" },
		{ date: "2021-12-31" },
		{ date: "2022-01-01", isCurrentMonth: true },
		{ date: "2022-01-02", isCurrentMonth: true },
		{ date: "2022-01-03", isCurrentMonth: true },
		{ date: "2022-01-04", isCurrentMonth: true },
		{ date: "2022-01-05", isCurrentMonth: true },
		{ date: "2022-01-06", isCurrentMonth: true },
		{ date: "2022-01-07", isCurrentMonth: true },
		{ date: "2022-01-08", isCurrentMonth: true },
		{ date: "2022-01-09", isCurrentMonth: true },
		{ date: "2022-01-10", isCurrentMonth: true },
		{ date: "2022-01-11", isCurrentMonth: true },
		{ date: "2022-01-12", isCurrentMonth: true, isToday: true },
		{ date: "2022-01-13", isCurrentMonth: true },
		{ date: "2022-01-14", isCurrentMonth: true },
		{ date: "2022-01-15", isCurrentMonth: true },
		{ date: "2022-01-16", isCurrentMonth: true },
		{ date: "2022-01-17", isCurrentMonth: true },
		{ date: "2022-01-18", isCurrentMonth: true },
		{ date: "2022-01-19", isCurrentMonth: true },
		{ date: "2022-01-20", isCurrentMonth: true },
		{ date: "2022-01-21", isCurrentMonth: true, isSelected: true },
		{ date: "2022-01-22", isCurrentMonth: true },
		{ date: "2022-01-23", isCurrentMonth: true },
		{ date: "2022-01-24", isCurrentMonth: true },
		{ date: "2022-01-25", isCurrentMonth: true },
		{ date: "2022-01-26", isCurrentMonth: true },
		{ date: "2022-01-27", isCurrentMonth: true },
		{ date: "2022-01-28", isCurrentMonth: true },
		{ date: "2022-01-29", isCurrentMonth: true },
		{ date: "2022-01-30", isCurrentMonth: true },
		{ date: "2022-01-31", isCurrentMonth: true },
		{ date: "2022-02-01" },
		{ date: "2022-02-02" },
		{ date: "2022-02-03" },
		{ date: "2022-02-04" },
		{ date: "2022-02-05" },
		{ date: "2022-02-06" },
	];

	return user ? (
		<>
			<StaffVerifyModal
				open={open}
				setOpen={setOpen}
				setUser={setUser}
			/>
			<div className="container h-full md:grid md:grid-cols-2 md:grid-rows-1 md:divide-x md:divide-gray-200 mt-20 mb-8">
				<div className="calendar my-auto md:pr-14">
					<div className="flex items-center">
						<h2 className="flex-auto text-sm font-semibold text-gray-900">
							January 2022
						</h2>
						<button
							type="button"
							className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
						>
							<span className="sr-only">Previous month</span>
							<ChevronLeftIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>
						</button>
						<button
							type="button"
							className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
						>
							<span className="sr-only">Next month</span>
							<ChevronRightIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>
						</button>
					</div>
					<div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
						<div>M</div>
						<div>T</div>
						<div>W</div>
						<div>T</div>
						<div>F</div>
						<div>S</div>
						<div>S</div>
					</div>
					<div className="mt-2 grid grid-cols-7 text-sm">
						{days.map((day, dayIdx) => (
							<div
								key={day.date}
								className={classNames(
									dayIdx > 6 && "border-t border-gray-200",
									"py-2"
								)}
							>
								<button
									type="button"
									className={classNames(
										day.isSelected && "text-white",
										!day.isSelected && day.isToday && "text-indigo-600",
										!day.isSelected &&
											!day.isToday &&
											day.isCurrentMonth &&
											"text-gray-900",
										!day.isSelected &&
											!day.isToday &&
											!day.isCurrentMonth &&
											"text-gray-400",
										day.isSelected && day.isToday && "bg-indigo-600",
										day.isSelected && !day.isToday && "bg-gray-900",
										!day.isSelected && "hover:bg-gray-200",
										(day.isSelected || day.isToday) && "font-semibold",
										"mx-auto flex h-8 w-8 items-center justify-center rounded-full"
									)}
								>
									<time dateTime={day.date}>
										{day.date.split("-").pop().replace(/^0/, "")}
									</time>
								</button>
							</div>
						))}
					</div>
				</div>
				{!display.title && !eventId ? ( // Will display an event if display has a key of title.
					<section className="event-display flex flex-col justify-center max-h-full mt-12 md:mt-0 md:pl-14 col-start-2 row-start-1">
						<Dropdown
							setDisplay={setDisplay}
							upcomingEvents={upcomingEvents}
							attendingEvents={attendingEvents}
						/>

						<ol className="mt-10 max-h-80 overflow-y-hidden space-y-1 text-sm leading-6 text-gray-500">
							{!display.title
								? display.map((event, i) => (
										<li
											key={`upcoming${i}`}
											className="group flex items-center space-x-4 rounded-xl px-4 py-2 focus-within:bg-gray-100 hover:bg-gray-100"
											onClick={() => {
												setPrevDisplay(display);
												setSearchParams({ eventId: event.event_id });
												setDisplay(event);
												setEventId(event.event_id);
											}}
										>
											<div className="flex-auto">
												<p className="text-gray-900">{event.title}</p>
												<p className="mt-0.5">
													<time dateTime={""}>
														{event.datetime.toDateString()}
													</time>{" "}
													{" at "}
													<time dateTime={""}>
														{event.datetime.toTimeString().slice(0, 9)}
													</time>
												</p>
											</div>
										</li>
								  ))
								: null}
						</ol>

						<PageButtons />
					</section>
				) : (
					<Event
						event={display}
						eventId={eventId}
						setEvent={setDisplay}
					/>
				)}
			</div>
			<div className="flex justify-around w-full md:w-3/4">
				<button
					type="button"
					className="relative w-1/3 md:w-[20%] inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
					onClick={(e) => {
						e.preventDefault();
						if (!user.staff) {
							setOpen(true);
						}
					}}
				>
					{user.staff ? (
						<PlusIcon
							className="-ml-0.5 h-5 w-5"
							aria-hidden="true"
						/>
					) : (
						<ClipboardDocumentCheckIcon
							className="-ml-0.5 h-5 w-5"
							aria-hidden="true"
						/>
					)}
					{user.staff ? "New Event" : "Staff Verify"}
				</button>
				<LogoutButton />
			</div>
		</>
	) : null;
}
