import { fetchEventById, editEvent } from "../api";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Loading from "./Loading";


const EditEvent = ({manipulateEventId, setManipulateEventId, errorSuccess, setErrorSuccess, submitDisabled, setSubmitDisabled, setOpen, setNewEventPosted, newEventPosted, setSearchParams, setEventId}) => {

    const [event, setEvent] = useState(null)


    // Input states
    const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [dateTime, setDateTime] = useState("");
    const [firstFocus, setFirstFocus] = useState([])

    useEffect(() => {
        setFirstFocus([])
        fetchEventById(manipulateEventId).then((event) => {
            setEvent(event)
            setTitle(event.title)
            setDescription(event.description)
            setLocation(event.location)
            setDateTime(format(event.datetime, "yyyy-MM-dd'T'HH:mm"))
        }).catch((err) => {
            setErrorSuccess("Failed to retrieve event data")
            setSubmitDisabled(true)
            setTimeout(() => {
                setOpen(false)
                setSubmitDisabled(false)
            }, 3000)
        })
    }, [])

    return( event ?
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
								<div className="sm:mx-auto sm:w-full sm:max-w-sm">
								  <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
									Edit Event
								  </h2>
                                  <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-4">
									{event.title}
								  </h2>
								</div>
								<form className="space-y-6" action="#" method="POST"
								onSubmit={(e) => {
									e.preventDefault();
                                    // shows an error if all fields are empty
                                    if (!title && !description && !dateTime && !location) {
                                        setErrorSuccess("Fill at least 1 field to edit an event.")
                                        setSubmitDisabled(true)
                                        setTimeout(() => {
                                            setErrorSuccess("")
                                            setSubmitDisabled(false)
                                        }, 3000)
                                    }
                                    else {
									setSubmitDisabled(true);
									editEvent(event.event_id, title, description, dateTime, location).then((event) => {
										setErrorSuccess("Successfully edited event.")
										setNewEventPosted(newEventPosted + 1)
										setTimeout(() => {
											setErrorSuccess("")
											setSubmitDisabled(false)
											setOpen(false)
											setEventId(event.event_id)
											setSearchParams({eventId: event.event_id})
										}, 3000)
									}).catch((err) => {
										setErrorSuccess("Failed to edit event.")
										setTimeout(() => {
											setErrorSuccess("")
											setSubmitDisabled(false)
										}, 3000)
									})
                                }
								}}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  value={title}
                  name="title"
                  autoComplete="title"
				  disabled={submitDisabled}
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => {
                    if (!firstFocus.includes("title")) {
                        setFirstFocus([...firstFocus, "title"])
                        setTitle("")
                    }
                  }}
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
                  value={location}
                  name="location"
                  autoComplete="location"
				  disabled={submitDisabled}
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => {
                    if (!firstFocus.includes("location")) {
                        setFirstFocus([...firstFocus, "location"])
                        setLocation("")
                    }
                  }}
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
                  value={description}
                  name="description"
                  autoComplete="description"
				  disabled={submitDisabled}
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => {
                    if (!firstFocus.includes("description")) {
                        setFirstFocus([...firstFocus, "description"])
                        setDescription("")
                    }
                  }}
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
                  value={dateTime}
                  name="datetime"
				  type="datetime-local"
                  autoComplete="datetime"
				  disabled={submitDisabled}
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				  onChange={(e) => {
                    setDateTime(e.target.value)
                  }}
                  onFocus={() => {
                    if (!firstFocus.includes("datetime")) {
                        setFirstFocus([...firstFocus, "datetime"])
                        setDateTime("")
                    }
                  }}
                />
              </div>
            </div>

            <div>
			<p
										className={
											"mt-2 text-sm pb-2" +
											(!errorSuccess ? "hidden" : "") + (errorSuccess === "Successfully edited event." ? " text-green-600" : " text-red-600")
										}
										id="event-edit-msg"
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
		  </div> : <Loading/>
    )
}

export default EditEvent;