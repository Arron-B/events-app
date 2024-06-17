import { useState } from "react";
import { postNewEvent } from "../api";
import { useUser } from "../UserContext.jsx";

const CreateEvent = ({errorSuccess, setErrorSuccess, submitDisabled, setSubmitDisabled, setOpen, setEventId, setSearchParams, 
    setDisplay, setNewEventPosted, newEventPosted}) => {

    const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [dateTime, setDateTime] = useState("");

    const user = useUser();

        
    return (
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
		  </div>
    )
}

export default CreateEvent;