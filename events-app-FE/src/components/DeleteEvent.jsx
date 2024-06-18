import { XCircleIcon } from "@heroicons/react/20/solid";
import { deleteEvent } from "../api";

const DeleteEvent = ({manipulateEventId, setManipulateEventId, errorSuccess, setErrorSuccess, submitDisabled, setSubmitDisabled, setOpen, newEventPosted, setNewEventPosted}) => {

    return (<div className="flex flex-col gap-4 justify-center align-center text-center">
        <XCircleIcon
							className="h-24 w-24 text-red-600 mx-auto"
							aria-hidden="true"
						/>
        <p className="block text-lg font-medium leading-6 text-gray-900">Are you sure you want to delete this event?</p>
        <div className="flex mx-auto mt-4 w-full justify-around">
        <button 
        disabled={submitDisabled}
        className="relative inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        onClick={() => setOpen(false)}>Cancel</button>
            <button 
            disabled={submitDisabled}
            className="relative inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            onClick={() => {
                setSubmitDisabled(true)
                deleteEvent(manipulateEventId).then((res) => {
                    setNewEventPosted(newEventPosted + 1)
                    setErrorSuccess("Successfully deleted event.")
                    setTimeout(() => {
                        setOpen(false)
                        setSubmitDisabled(false)
                        setErrorSuccess("")
                    }, 3000)
                }).catch((err) => {
                    setErrorSuccess("Failed to delete.")
                    setTimeout(() => {
                        setErrorSuccess("")
                        setSubmitDisabled(false)
                    }, 3000)
                })
            }}
            >Delete</button>
        </div>
        <p
										className={
											"mt-2 text-sm" +
											(!errorSuccess ? " hidden" : "") +
											(errorSuccess == "Successfully deleted event."
												? " text-green-600"
												: " text-red-600")
										}
										id="password-error"
									>
										{errorSuccess}
									</p>
    </div>)
}

export default DeleteEvent;