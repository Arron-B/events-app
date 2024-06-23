import { useEffect, useState } from "react";
import { useUser } from "../UserContext.jsx";
import { fetchUserById, fetchEventById, fetchAttendance, fetchAttending, attendEvent, removeAttendEvent, fetchAttendees } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlus } from "@fortawesome/free-brands-svg-icons";
import {
	CalendarDaysIcon,
	NewspaperIcon,
	UserCircleIcon,
	ClockIcon,
	MapPinIcon,
	UserGroupIcon,
	PlusIcon,
	XMarkIcon, ChevronLeftIcon
} from "@heroicons/react/20/solid";
import { google } from "calendar-link";
import Loading from "./Loading";

export default function Event({ event, eventId, setEventId, prevDisplay,  setDisplay, upcomingEvents, setSearchParams, searchParams, userAttendingThis, setUserAttendingThis, selection, attendingEvents, myEvents }) {
	const [organiser, setOrganiser] = useState(null);
	const [attendance, setAttendance] = useState(null);
	
	const [googleUrl, setGoogleUrl] = useState(null)
	const [attendButtonActive, setAttendButtonActive] = useState(true)
	const [isLoading, setIsLoading] = useState(true)

	const user = useUser();

	useEffect(() => {
		setUserAttendingThis(false)
		fetchEventById(eventId)
			.then((eventParsed) => {
				setDisplay(eventParsed);
				setGoogleUrl(google({
					title: eventParsed.title,
					description: eventParsed.description,
					location: eventParsed.location,
					start: eventParsed.datetime,
					duration: [1, "hour"]
				}));
				fetchUserById(eventParsed.organiser)
					.then((res) => {
						setOrganiser(res.data.user.name);
						setIsLoading(false)
					})
					.catch((err) => {
					});
			})
			.catch((err) => {
			});

		fetchAttendance(eventId)
			.then((res) => {
				
				setAttendance(res.data.attendance.attendance)

			})
			.catch((err) => {
			});

		fetchAttendees(eventId)
		.then((res) => {
			const attendees = res.data.attendees
			attendees.forEach((attendee) => {
				if (attendee.name === user.name) {
					setUserAttendingThis(true)
					setIsLoading(false)
				}
			})
			
		})
			.catch((err) => {
				setUserAttendingThis(false)
				setIsLoading(false)
			})
		
		
	}, [eventId, searchParams]);

	return event.datetime && !isLoading ? (
		<div className="">
			<h2 className="sr-only">Event titled {event.title}</h2>
			<div className="h-full flex flex-col justify-around rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
				<dl className="relative flex flex-wrap">
					<div className="flex-auto pl-6">
						<dt className="text-sm font-semibold leading-6 text-gray-900">
							<span className="sr-only">Event title</span>
						</dt>
						<dd className="text-base text-start font-semibold leading-6 text-gray-900">
							{event.title}
						</dd>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<span className="sr-only">Event description</span>
							<NewspaperIcon
								className="h-6 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</dt>
						<dd className="text-sm leading-6 text-gray-500">
							<p className="text-left">{event.description}</p>
						</dd>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-2 border-t border-gray-900/5 px-6 pt-6">
						<dt className="flex-none text-sm leading-6 font-medium">Organiser:</dt>
						<dd className="flex gap-x-1 text-sm font-medium leading-6 text-gray-900">
							<UserCircleIcon
								className="h-6 w-5 text-gray-400"
								aria-hidden="true"
							/>{" "}
							{organiser}
						</dd>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<span className="sr-only">Date of event</span>
							<CalendarDaysIcon
								className="h-6 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</dt>
						<dd className="text-sm leading-6 text-gray-500">
							<time dateTime="">
								{event.datetime ? event.datetime.toDateString() : null}
							</time>
						</dd>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<span className="sr-only">Time of event</span>
							<ClockIcon
								className="h-6 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</dt>
						<dd className="text-sm leading-6 text-gray-500">
							<time dateTime="">
								{event.datetime.toTimeString().slice(0, 9)}
							</time>
						</dd>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<span className="sr-only">Location of event</span>
							<MapPinIcon
								className="h-6 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</dt>
						<dd className="text-sm leading-6 text-gray-500">
							{event.location}
						</dd>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<span className="sr-only">Number of people attending</span>
							<UserGroupIcon
								className="h-6 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</dt>
						<dd className="text-sm leading-6 text-gray-500">{`${attendance} people attending`}</dd>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<button
							type="button"
							disabled={!attendButtonActive}
							className={"rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" + (userAttendingThis ? " hidden" : "")}
							onClick={() => {
								setAttendButtonActive(false)
								attendEvent(eventId, user.user_id).then((res) => {
									setUserAttendingThis(true)
									setTimeout(() => {
										setAttendButtonActive(true)
										setAttendButtonActive(true)
									}, 3000)
								}).catch((err) => {
									setTimeout(() => {
										setAttendButtonActive(true)
									}, 3000)
								})
							}}
						>
							<span className="sr-only">Button attend event</span>
							<PlusIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>{" "}
						</button>{" "}
						<button
							type="button"
							disabled={!attendButtonActive}
							className={"rounded-full bg-red-600 p-1 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" + (!userAttendingThis ? " hidden" : "")}
							onClick={() => {
								setAttendButtonActive(false)
								removeAttendEvent(eventId, user.user_id).then((res) => {
									setUserAttendingThis(false)
									setTimeout(() => {
										setAttendButtonActive(true)
									}, 3000)
								}).catch((err) => {
									setTimeout(() => {
										setAttendButtonActive(true)
									}, 3000)
								})
							}}
						>
							<span className="sr-only">Button cancel attendance</span>
							<XMarkIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>{" "}
						</button>{" "}
						<p className="text-md leading-6 text-gray-500 landscape:md:text-sm">{userAttendingThis ? "Cancel" : "Attend Event"}</p>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<span className="sr-only">Button add event to google calendar</span>
						<a className="flex gap-4"
						href={googleUrl}
						target="_blank">
						<FontAwesomeIcon
							className="h-5 w-5 rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							icon={faGooglePlus}
							aria-hidden="true"
						/>

						<p className="text-md leading-6 text-gray-500 landscape:md:text-sm">
							Add to Google Calendar
						</p>
						</a>
					</div>
					<div className="mt-4 flex flex-none px-6">
					<button
							type="button"
							className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 portrait:absolute portrait:top-28 portrait:right-10"
							onClick={() => {
									console.log(prevDisplay);
									
									if (prevDisplay) {
										setDisplay(prevDisplay)
										setSearchParams("")
									}
									else if (selection === "Upcoming Events") {
										setDisplay(upcomingEvents) 
										setSearchParams("")
									}
									else if (selection === "My Events") {
											setDisplay(myEvents)
											setSearchParams("")
										}
									else if (selection === "Attending") {
												setDisplay(attendingEvents) 
												setSearchParams("")
											}
										
							}}
						>
							<span className="sr-only">Back to event list</span>
							<ChevronLeftIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>
							<p className="text-md leading-6 text-gray-500 landscape:md:text-sm">
							Back
						</p>
						</button>
						
						</div>
				</dl>
			</div>
		</div>
	) : (
		<Loading />
	);
}
