import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../UserContext.jsx";
import { startOfToday, format, isSameDay } from "date-fns";
import { fetchUpcomingEvents, fetchAttending, staffVerify } from "../api.js";
import LogoutButton from "./LogoutButton.jsx";
import Modal from "./Modal.jsx";
import Event from "./Event.jsx";
import Calendar from "./Calendar.jsx";
import { pageHandler } from "../../utils.js";

import {
	PlusIcon,
	ClipboardDocumentCheckIcon,
	TrashIcon,
	PencilSquareIcon
} from "@heroicons/react/20/solid";
import { useAuth0 } from "@auth0/auth0-react";
import Dropdown from "./Dropdown.jsx";
import PageButtons from "./PageButtons.jsx";

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
	const [userAttendingThis, setUserAttendingThis] = useState(false)

	// Calendar states
	const [today, setToday] = useState(startOfToday())
	const [selectedDay, setSelectedDay] = useState(startOfToday())

	const user = useUser();

	useEffect(() => {
		if (!isInitialMount.current) setSelection("Events on " + format(selectedDay, 'MMM dd, yyy'))
	}, [selectedDay])

	useEffect(() => {  // sets upcoming event lists on load/reload
		setPage(1)
		setEventId(searchParams.get("eventId") || null);
		if(eventId) {
			setDisplay({event_id: eventId})
		}
		fetchUpcomingEvents()
			.then((eventsParsed) => {
				setUpcomingEvents(eventsParsed);
				setDisplay(eventsParsed);
			})
			.catch((err) => {
			});
			
	}, []);

	useEffect(() => { // updates event lists on new event submission, event deletion or an event being edited
		if (isInitialMount.current) { // prevents running contents on initial mount
			isInitialMount.current = false;
		}
		else {
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
			});
		}
	}, [newEventPosted]);

	useEffect(() => { // sets attending list upon user authentication. refreshing on attending, cancelling or editing/deleting/posting an event
		fetchAttending(user.user_id)
			.then((eventsParsed) => {
				setAttendingEvents(eventsParsed);
				setPrevDisplay(null)
			})
			.catch((err) => {
			});
	}, [user, userAttendingThis, newEventPosted]);

	useEffect(() => { // sets my events list if user is staff and whenever upcoming events changes
		if (user.staff) {
			const filterMyEvents = upcomingEvents.filter((event) => event.organiser === user.user_id)
			setMyEvents(filterMyEvents)
		}
	}, [upcomingEvents]);


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
			<div className="portrait:pb-8 container portrait:h-[80svh] portrait:flex portrait:flex-col landscape:grid landscape:grid-cols-2 landscape:grid-rows-1 landscape:divide-x landscape:divide-gray-200">

				<Calendar
				today={today}
				setToday={setToday}
				selectedDay={selectedDay}
				setSelectedDay={setSelectedDay}
				upcomingEvents={upcomingEvents}
				setDisplay={setDisplay}
				/>
				
				{!display.event_id ? ( // Will display an event if display has a key of title.
					<section className="event-display landscape:my-4 portrait:mt-0 flex flex-col justify-center max-h-full md:mt-0 landscape:md:pl-14 col-start-2 row-start-1">
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

						<ol className="mt-3 overflow-y-hidden space-y-1 text-sm leading-6 text-gray-500">
							{
								pageHandler(display, page).map((event, i) => (
									
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
								}
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
						userAttendingThis={userAttendingThis}
						setUserAttendingThis={setUserAttendingThis}
						selection={selection}
						attendingEvents={attendingEvents}
						myEvents={myEvents}
					/>
				)}
			</div>
			<div className="flex justify-around w-full md:w-3/4 fixed bottom-5">
				<button
					type="button"
					className="relative w-1/3 md:w-[20%] inline-flex items-center justify-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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