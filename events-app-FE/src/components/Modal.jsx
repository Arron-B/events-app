import { useState } from "react";
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import { useUser } from "../UserContext.jsx";
import Loading from "./Loading.jsx";
import { staffVerify, setAsStaff, postNewEvent } from "../api.js";

export default function Modal({ open, setOpen, setEventId, setSearchParams, setDisplay, setNewEventPosted, newEventPosted }) {
	const [password, setPassword] = useState("");
	const [errorSuccess, setErrorSuccess] = useState("");

	const [submitDisabled, setSubmitDisabled] = useState(false);
	const [loading, setLoading] = useState(false);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [dateTime, setDateTime] = useState("");



	const user = useUser();

	return (
		<Transition show={open}>
			<Dialog
				className="relative z-10"
				onClose={setOpen}
			>
				<TransitionChild
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</TransitionChild>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<TransitionChild
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
								{ !user.staff ? <form
									onSubmit={(e) => {
										e.preventDefault();
										setSubmitDisabled(true);
										staffVerify(password)
											.then((res) => {
												setErrorSuccess("Password correct.");
												
												setAsStaff(user.user_id)
													.then((res) => {
														location.reload();
													})
													.catch((err) => {
														setErrorSuccess("Something went wrong.");
														setTimeout(() => {
															setErrorSuccess("");
															setSubmitDisabled(false);
														}, 3000);
													});

												setTimeout(() => {
													setErrorSuccess("");
												}, 3000);
											})
											.catch((err) => {
												setErrorSuccess("Password incorrect.");
												setTimeout(() => {
													setErrorSuccess("");
													setSubmitDisabled(false);
												}, 3000);
											});
									}}
								>
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Password
									</label>
									<div className="mt-2">
										<input
											type="password"
											name="password"
											id="password"
											disabled={submitDisabled}
											className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											placeholder=""
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
									</div>
									<p
										className={
											"mt-2 text-sm" +
											(!errorSuccess ? "hidden" : "") +
											(errorSuccess == "Password correct."
												? " text-green-600"
												: " text-red-600")
										}
										id="password-error"
									>
										{errorSuccess}
									</p>
								</form> :    
								<div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
								<div className="sm:mx-auto sm:w-full sm:max-w-sm">
								  <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
									Create a new event
								  </h2>
								</div>
								<form className="space-y-6" action="#" method="POST"
								onSubmit={(e) => {
									e.preventDefault();
									setSubmitDisabled(true);
									postNewEvent(title, description, user.user_id, dateTime, location).then((event) => {
										setErrorSuccess("Successfully posted event.")
										setNewEventPosted(newEventPosted + 1)
										setTimeout(() => {
											setErrorSuccess("")
											setSubmitDisabled(false)
											setOpen(false)
											setEventId(event.event_id)
											setSearchParams({eventId: event.event_id})
											setDisplay(event)
										}, 3000)
									}).catch((err) => {
										console.log(err);
										setErrorSuccess("Failed to create event.")
										setTimeout(() => {
											setErrorSuccess("")
											setSubmitDisabled(false)
										}, 3000)
									})
								}}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  autoComplete="title"
				  disabled={submitDisabled}
                  required
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

			

			<div>
              <div className="flex items-center justify-between">
                <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                  Location
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="location"
                  name="location"
                  autoComplete="location"
				  disabled={submitDisabled}
                  required
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

			<div>
              <div className="flex items-center justify-between">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="description"
                  name="description"
                  autoComplete="description"
				  disabled={submitDisabled}
                  required
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

			<div>
              <div className="flex items-center justify-between">
                <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                  Date & Time
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="datetime"
                  name="datetime"
				  type="datetime-local"
                  autoComplete="datetime"
				  disabled={submitDisabled}
                  required
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				  onChange={(e) => setDateTime(e.target.value)}
                />
              </div>
            </div>

            <div>
			<p
										className={
											"mt-2 text-sm pb-2" +
											(!errorSuccess ? "hidden" : "") + (errorSuccess === "Failed to create event." ? " text-red-600" : " text-green-600")
										}
										id="event-post-msg"
									>
										{errorSuccess}
									</p>
              <button
                type="submit"
				disabled={submitDisabled}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </form>
		  </div> }
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
