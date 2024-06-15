import { useEffect, useState } from "react";
import { useUser } from "../UserContext.jsx";
import { fetchUserById, fetchEventById, fetchAttendance, fetchAttending, attendEvent, removeAttendEvent } from "../api";
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
} from "@heroicons/react/20/solid";
import Loading from "./Loading";

export default function Event({ event, setEvent, eventId, attendingEvents, setAttendingEvents }) {
	const [organiser, setOrganiser] = useState(null);
	const [attendance, setAttendance] = useState(null);
	const [userAttendingThis, setUserAttendingThis] = useState(false)

	const user = useUser();

	useEffect(() => {
		setUserAttendingThis(false)
		fetchEventById(eventId)
			.then((eventParsed) => {
				setEvent(eventParsed);
				fetchUserById(eventParsed.organiser)
					.then((res) => {
						setOrganiser(res.data.user.name);
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});

		fetchAttendance(eventId)
			.then((res) => {
				
				setAttendance(res.data.attendance.attendance)

			})
			.catch((err) => {
				console.log(err);
			});

		fetchAttending(user.user_id)
		.then((eventsParsed) => {
			setAttendingEvents(eventsParsed)
			eventsParsed.forEach((event) => {
				if (event.event_id === eventId) {
					setUserAttendingThis(true)
				}
			})
		})
		
	}, [eventId]);

	return event.datetime ? (
		<div className="">
			<h2 className="sr-only">Event titled {event.title}</h2>
			<div className="h-full flex flex-col justify-around rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
				<dl className="flex flex-wrap">
					<div className="flex-auto pl-6">
						<dt className="text-sm font-semibold leading-6 text-gray-900">
							<span className="sr-only">Event title</span>
						</dt>
						<dd className="text-base font-semibold leading-6 text-gray-900">
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
						<dt className="flex-none">Organiser:</dt>
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
							className="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							<span className="sr-only">Button attend event</span>
							<PlusIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>{" "}
						</button>{" "}
						<p className="text-md leading-6 text-gray-500">Attend Event</p>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<span className="sr-only">Button attend event</span>
						<FontAwesomeIcon
							className="h-5 w-5 rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							icon={faGooglePlus}
							aria-hidden="true"
						/>

						<p className="text-md leading-6 text-gray-500">
							Add to Google Calendar
						</p>
					</div>
				</dl>
			</div>
		</div>
	) : (
		<Loading />
	);
}
