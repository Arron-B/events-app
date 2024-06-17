import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../UserContext.jsx";
import { fetchUpcomingEvents, fetchAttending, staffVerify } from "../api.js";
import LogoutButton from "./LogoutButton.jsx";
import Modal from "./Modal.jsx";
import Event from "./Event.jsx";
import { pageHandler } from "../../utils.js";

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PlusIcon,
	ClipboardDocumentCheckIcon,
	TrashIcon,
	PencilSquareIcon
} from "@heroicons/react/20/solid";
import { useAuth0 } from "@auth0/auth0-react";
import Dropdown from "./Dropdown.jsx";
import PageButtons from "./PageButtons.jsx";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Home({ setUser }) {
	let [searchParams, setSearchParams] = useSearchParams();
	const isInitialMount = useRef(true); // checking if page is mounted

	const [open, setOpen] = useState(false); //modal controls
	const { isAuthenticated, isLoading } = useAuth0();
	const [display, setDisplay] = useState([]);
	const [prevDisplay, setPrevDisplay] = useState(null);
	const [eventId, setEventId] = useState(searchParams.get("eventId") || null);
	const [page, setPage] = useState(2);
	const [upcomingEvents, setUpcomingEvents] = useState([]);
	const [attendingEvents, setAttendingEvents] = useState([]);
	const [myEvents, setMyEvents] = useState([]);
	const [newEventPosted, setNewEventPosted] = useState(1); // triggers update of event lists on event creation, deletion or edit
	const [selection, setSelection] = useState("Upcoming Events"); // sets text showing in closed dropdown bar
	const [staffAction, setStaffAction] = useState(null)
	const [manipulateEventId, setManipulateEventId] = useState("")

	const user = useUser();

	useEffect(() => {  // sets upcoming event lists on load/reload
		setPage(1)
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

	useEffect(() => { // updates event lists on new event submission, event deletion or an event being edited
		if (isInitialMount.current) { // prevents running contents on initial mount
			isInitialMount.current = false;
		}
		else {
		console.log("updating lists");
		fetchUpcomingEvents()
			.then((eventsParsed) => {
				setUpcomingEvents(eventsParsed);
				setPrevDisplay(null)   // prevents back button on event component from displaying out of date list
				setSelection("Upcoming Events")
				setPage(1)
				if (staffAction !== "create") { // displays updated event list after an event edit or delete
					setDisplay(eventsParsed)
				}
			})
			.catch((err) => {
				console.log(err);
			});
		}
	}, [newEventPosted]);

	useEffect(() => { // sets attending list upon user authentication
		fetchAttending(user.user_id)
			.then((eventsParsed) => {
				setAttendingEvents(eventsParsed);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [user]);

	useEffect(() => { // sets my events list if user is staff and whenever upcoming events changes
		if (user.staff) {
			const filterMyEvents = upcomingEvents.filter((event) => event.organiser === user.user_id)
			setMyEvents(filterMyEvents)
		}
	}, [upcomingEvents]);

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
			<Modal
				open={open}
				setOpen={setOpen}
				setEventId={setEventId}
				setSearchParams={setSearchParams}
				display={display}
				setDisplay={setDisplay}
				setPrevDisplay={setPrevDisplay}
				setNewEventPosted={setNewEventPosted}
				newEventPosted={newEventPosted}
				staffAction={staffAction}
				setStaffAction={setStaffAction}
				manipulateEventId={manipulateEventId}
				setManipulateEventId={setManipulateEventId}
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
							display={display}
							upcomingEvents={upcomingEvents}
							attendingEvents={attendingEvents}
							myEvents={myEvents}
							setPage={setPage}
							setPrevDisplay={setPrevDisplay}
							selection={selection}
							setSelection={setSelection}
						/>

						<ol className="mt-3 max-h-96 h-96 overflow-y-hidden space-y-1 text-sm leading-6 text-gray-500">
							{!display.title
								? pageHandler(display, page).map((event, i) => (
									
										<li
											key={`upcoming${i}`}
											className="group relative flex items-center space-x-4 rounded-xl px-4 py-2 focus-within:bg-gray-100 hover:bg-gray-100"
										>
											<div className="flex-auto"
											onClick={() => {
												setPrevDisplay(display);
												setSearchParams({ eventId: event.event_id });
												setDisplay(event);
												setEventId(event.event_id);
												console.log(event);
											}}>
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
											<span className="sr-only">Button to edit event</span>
											<button className="absolute left-0"
											onClick={() => {
												setManipulateEventId(event.event_id)
												setStaffAction("edit")
												setOpen(true)
											}}>
											<PencilSquareIcon
							className={
								"h-5 w-5 text-blue-600" + (user.user_id !== event.organiser ? " hidden" : "")
							}
							aria-hidden="true"
						/>
						</button>
						<span className="sr-only">Button to delete event</span>
						<button className="absolute right-0"
						onClick={() => {
							setManipulateEventId(event.event_id)
							setStaffAction("delete")
							setOpen(true)
						}}>
						<TrashIcon	
							className={
								"h-5 w-5 text-red-500" + (user.user_id !== event.organiser ? " hidden" : "")
							}
							aria-hidden="true"
						/>
						</button>
											
										</li>
								  ))
								: null}
						</ol>

						<PageButtons page={page} setPage={setPage} display={display} />
					</section>
				) : (
					<Event
						event={display}
						eventId={eventId}
						setEventId={setEventId}
						prevDisplay={prevDisplay}
						setDisplay={setDisplay}
						upcomingEvents={upcomingEvents}
						setSearchParams={setSearchParams}
						searchParams={searchParams}
					/>
				)}
			</div>
			<div className="flex justify-around w-full md:w-3/4">
				<button
					type="button"
					className="relative w-1/3 md:w-[20%] inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
					onClick={(e) => {
						e.preventDefault();
							setOpen(true);
							if (user.staff) {
								setStaffAction("create")
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
